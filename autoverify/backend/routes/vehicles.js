const router  = require('express').Router();
const protect = require('../middleware/auth');
const Report  = require('../models/Report');
const User    = require('../models/User');

// ── Mock Vehicle Database (replace with real VAHAN API) ─────
const MOCK_DB = {
  'PB10BF1234': {
    make:'Maruti Suzuki',model:'Swift',variant:'VXI',year:2018,
    fuelType:'Petrol',transmission:'Manual',color:'Pearl Arctic White',
    engineCC:1197,ownerCount:2,rto:'PB-10 Ludhiana',city:'Ludhiana',odometer:61400,
    insuranceExpiry:'2025-08-15',pucExpiry:'2025-11-20',
    engineHealth:72,transmissionHealth:85,bodyCondition:68,interior:80,
    actualMileage:17.8,araiMileage:22,annualAvg:10233,serviceOverdueKm:1400,
    challans:[
      {type:'Over-speeding',location:'NH-44',date:'2022-03-12',amount:2000,status:'paid'},
      {type:'Signal jump',location:'Ludhiana',date:'2022-08-05',amount:1000,status:'paid'},
      {type:'Parking violation',location:'Ludhiana',date:'2024-01-19',amount:500,status:'pending'}
    ],
    marketMin:380000,marketMax:460000,suggestedMin:420000,suggestedMax:450000,
    accidents:0,blacklisted:false,stolen:false,loanClear:true,
    trustScore:74,riskLevel:'moderate',
    aiVerdict:'This vehicle is conditionally safe to buy. Engine shows moderate wear (72%) consistent with city driving. 1 pending challan must be settled before RC transfer. Asking price is likely overvalued — negotiate firmly to ₹4,20,000–₹4,35,000. Service history gap suggests the 60,000 km service may have been skipped. Recommend an independent mechanic inspection before finalizing the purchase.'
  },
  'DL3CAF5678': {
    make:'Honda',model:'City',variant:'ZX CVT',year:2020,
    fuelType:'Petrol',transmission:'Automatic',color:'Lunar Silver Metallic',
    engineCC:1498,ownerCount:1,rto:'DL-3 Delhi',city:'New Delhi',odometer:38200,
    insuranceExpiry:'2026-03-10',pucExpiry:'2026-01-15',
    engineHealth:91,transmissionHealth:93,bodyCondition:88,interior:90,
    actualMileage:15.2,araiMileage:17.8,annualAvg:9550,serviceOverdueKm:0,
    challans:[],
    marketMin:850000,marketMax:980000,suggestedMin:870000,suggestedMax:920000,
    accidents:0,blacklisted:false,stolen:false,loanClear:true,
    trustScore:91,riskLevel:'low',
    aiVerdict:'Excellent condition vehicle with a clean history. Single owner, zero challans, no accidents, and well within service schedule. Engine health is outstanding at 91%. This is a reliable purchase — negotiate mildly to bring it closer to the market fair value range.'
  },
  'HR26DQ9012': {
    make:'Hyundai',model:'Creta',variant:'S 1.5 Diesel',year:2019,
    fuelType:'Diesel',transmission:'Manual',color:'Phantom Black',
    engineCC:1493,ownerCount:3,rto:'HR-26 Gurugram',city:'Gurugram',odometer:95000,
    insuranceExpiry:'2024-12-01',pucExpiry:'2025-02-10',
    engineHealth:48,transmissionHealth:55,bodyCondition:40,interior:52,
    actualMileage:13.4,araiMileage:21.4,annualAvg:16200,serviceOverdueKm:3200,
    challans:[
      {type:'Over-speeding',location:'NH-48',date:'2021-05-10',amount:2000,status:'paid'},
      {type:'Drunk driving',location:'Gurugram',date:'2022-11-03',amount:10000,status:'paid'},
      {type:'Document missing',location:'Gurugram',date:'2023-07-22',amount:5000,status:'pending'},
      {type:'Over-speeding',location:'NH-48',date:'2024-01-08',amount:2000,status:'pending'}
    ],
    marketMin:600000,marketMax:750000,suggestedMin:550000,suggestedMax:620000,
    accidents:2,blacklisted:false,stolen:false,loanClear:false,
    trustScore:42,riskLevel:'high',
    aiVerdict:'HIGH RISK — Avoid or inspect extremely carefully. This is a 3rd owner diesel with 95,000 km, 2 accident records, active loan on the vehicle, and multiple pending challans including drunk driving. Engine health is critically low at 48%. Significant repair investment will be needed. If proceeding, negotiate aggressively and get a comprehensive mechanical + legal inspection first.'
  },
  'MH01AQ3456': {
    make:'Tata',model:'Nexon',variant:'XM S',year:2021,
    fuelType:'Petrol',transmission:'Manual',color:'Foliage Green',
    engineCC:1199,ownerCount:1,rto:'MH-01 Mumbai',city:'Mumbai',odometer:28500,
    insuranceExpiry:'2026-09-20',pucExpiry:'2025-12-01',
    engineHealth:88,transmissionHealth:90,bodyCondition:85,interior:87,
    actualMileage:14.8,araiMileage:17.4,annualAvg:9500,serviceOverdueKm:0,
    challans:[
      {type:'Parking violation',location:'Mumbai',date:'2023-03-15',amount:500,status:'paid'}
    ],
    marketMin:720000,marketMax:850000,suggestedMin:730000,suggestedMax:800000,
    accidents:0,blacklisted:false,stolen:false,loanClear:true,
    trustScore:88,riskLevel:'low',
    aiVerdict:'Very good condition vehicle. First owner, low mileage, insurance valid till 2026, and only one minor paid challan. Engine health is strong at 88%. A reliable urban car — negotiate modestly and confirm service records for a smooth purchase.'
  },
  'KA05MJ7890': {
    make:'Toyota',model:'Innova Crysta',variant:'GX 2.4',year:2019,
    fuelType:'Diesel',transmission:'Manual',color:'White Pearl',
    engineCC:2393,ownerCount:2,rto:'KA-05 Bangalore',city:'Bangalore',odometer:74000,
    insuranceExpiry:'2025-06-30',pucExpiry:'2025-08-15',
    engineHealth:78,transmissionHealth:82,bodyCondition:75,interior:80,
    actualMileage:11.2,araiMileage:15.1,annualAvg:14800,serviceOverdueKm:600,
    challans:[
      {type:'Over-loading',location:'Bangalore',date:'2022-08-20',amount:2000,status:'paid'}
    ],
    marketMin:1450000,marketMax:1750000,suggestedMin:1500000,suggestedMax:1650000,
    accidents:0,blacklisted:false,stolen:false,loanClear:true,
    trustScore:78,riskLevel:'moderate',
    aiVerdict:'Moderately safe purchase. High annual mileage suggests this was used for commercial or inter-city travel. Engine is still healthy at 78%. Service slightly overdue — ensure the next service is done at handover. Insurance expires mid-2025, factor renewal cost into negotiation.'
  }
};

// Generate deterministic mock data for unknown plates
function generateMockData(reg) {
  const seed = reg.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng  = (min, max) => min + (seed % (max - min + 1));
  const yr   = 2018 + rng(0, 5);
  const km   = rng(15000, 80000);
  const eng  = rng(60, 92);
  const ts   = rng(60, 88);
  return {
    make:'Maruti Suzuki',model:'Wagon R',variant:'VXI',year:yr,
    fuelType: seed % 2 === 0 ? 'Petrol' : 'CNG',
    transmission:'Manual',color:'Cerulean Blue',
    engineCC:998,ownerCount:1 + (seed % 2),
    rto:`State RTO`,city:'India',odometer:km,
    insuranceExpiry:'2025-12-31',pucExpiry:'2025-09-30',
    engineHealth:eng,transmissionHealth:rng(70,95),
    bodyCondition:rng(65,88),interior:rng(68,90),
    actualMileage:rng(16,22),araiMileage:23.56,
    annualAvg:rng(8000,14000),serviceOverdueKm:rng(0,800),
    challans: seed % 3 === 0
      ? [{type:'Over-speeding',location:'Highway',date:'2023-06-01',amount:1000,status:'paid'}]
      : [],
    marketMin:280000,marketMax:420000,suggestedMin:290000,suggestedMax:400000,
    accidents: seed % 7 === 0 ? 1 : 0,
    blacklisted:false,stolen:false,loanClear: seed % 5 !== 0,
    trustScore:ts,
    riskLevel: ts >= 80 ? 'low' : ts >= 60 ? 'moderate' : 'high',
    aiVerdict:'Vehicle records retrieved successfully. Condition appears adequate based on available data. Always verify service history directly with the seller and get an independent mechanical inspection before finalizing any used car purchase.'
  };
}

// ── POST /api/vehicles/analyze ──────────────────────────────
router.post('/analyze', protect, async (req, res) => {
  try {
    const { registrationNumber, askingPrice } = req.body;
    if (!registrationNumber) {
      return res.status(400).json({ success: false, message: 'Registration number is required.' });
    }

    const user = await User.findById(req.user._id);
    if (user.checksRemaining <= 0 && user.plan === 'free') {
      return res.status(403).json({
        success: false,
        message: 'No checks remaining. Please upgrade your plan to continue.'
      });
    }

    const reg  = registrationNumber.toUpperCase().replace(/\s/g, '');
    const data = MOCK_DB[reg] || generateMockData(reg);
    const ap   = Number(askingPrice) || 0;
    const overvaluedBy = ap > 0 ? Math.max(0, ap - data.marketMax) : 0;

    const report = await Report.create({
      userId: user._id,
      registrationNumber: reg,
      askingPrice: ap,
      vehicleDetails: {
        make: data.make, model: data.model, variant: data.variant,
        year: data.year, fuelType: data.fuelType, transmission: data.transmission,
        color: data.color, engineCC: data.engineCC, ownerCount: data.ownerCount,
        rto: data.rto, city: data.city, odometer: data.odometer
      },
      engineHealth: {
        engine: data.engineHealth, transmission: data.transmissionHealth,
        body: data.bodyCondition, interior: data.interior
      },
      mileage: {
        actual: data.actualMileage, araiRated: data.araiMileage,
        annualAvg: data.annualAvg, serviceOverdueKm: data.serviceOverdueKm
      },
      challans: data.challans,
      pricing: {
        askingPrice: ap, marketMin: data.marketMin, marketMax: data.marketMax,
        suggestedMin: data.suggestedMin, suggestedMax: data.suggestedMax,
        overvaluedBy
      },
      safety: {
        accidents: data.accidents, blacklisted: data.blacklisted,
        stolen: data.stolen, loanClear: data.loanClear,
        insuranceExpiry: new Date(data.insuranceExpiry),
        pucExpiry: new Date(data.pucExpiry)
      },
      trustScore: data.trustScore,
      riskLevel:  data.riskLevel,
      aiVerdict:  data.aiVerdict,
      status: 'completed'
    });

    // Deduct credit & update totals
    const fraudCaughtIncrement = data.riskLevel === 'high' ? 1 : 0;
    await User.findByIdAndUpdate(user._id, {
      $inc: { checksRemaining: -1, totalChecks: 1, fraudCaught: fraudCaughtIncrement }
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/vehicles/history ───────────────────────────────
router.get('/history', protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('registrationNumber vehicleDetails trustScore riskLevel createdAt status');
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
