
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bell, 
  Menu, 
  PieChart as PieChartIcon, 
  Home, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Download, 
  Plus,
  MessageSquare,
  Wallet,
  ArrowRight,
  X,
  Target,
  Trophy,
  PiggyBank,
  BarChart2,
  Smile,
  Meh,
  Frown,
  Zap,
  Calendar,
  RefreshCw,
  CreditCard,
  Check
} from 'lucide-react';

// --- Components ---
// (Due to space, this file includes the user's App component adapted to run in Vite + Tailwind)
// The code below is mostly the same as you provided, with small safety fixes:
// - parseInt(..., 10)
// - functional setState for arrays
// - timeout cleanup via ref
// - getDaysLeft returns signed days
// - clamped progress percentages
// NOTE: keep improving as needed.

const MascotWidget = ({ mood, message, isAnimating }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [mood]);

  const baseUrl = "https://api.dicebear.com/7.x/bear/svg";

  let avatarParams = "";
  let borderColor = "border-emerald-200";
  let fallbackColor = "bg-emerald-100 text-emerald-600";

  if (mood === 'happy') {
     avatarParams = "?seed=Willow&backgroundColor=b6e3f4"; 
     borderColor = "border-emerald-200";
     fallbackColor = "bg-emerald-100 text-emerald-600";
  } else if (mood === 'concerned') {
     avatarParams = "?seed=Midnight&backgroundColor=ffdfbf"; 
     borderColor = "border-orange-200";
     fallbackColor = "bg-orange-100 text-orange-600";
  } else if (mood === 'angry') {
     avatarParams = "?seed=Gizmo&backgroundColor=ffb3b3"; 
     borderColor = "border-red-200";
     fallbackColor = "bg-red-100 text-red-600";
  } else if (mood === 'excited') {
     avatarParams = "?seed=Cookie&backgroundColor=fff5b3"; 
     borderColor = "border-yellow-200";
     fallbackColor = "bg-yellow-100 text-yellow-600";
  }

  const avatarUrl = `${baseUrl}${avatarParams}`;

  return (
    <div className={`flex items-start gap-3 mb-6 transition-all duration-500 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className={`w-16 h-16 rounded-full overflow-hidden shadow-md border-4 ${borderColor} bg-white transition-colors duration-500 flex items-center justify-center`}>
          {!imgError ? (
            <img 
              src={avatarUrl} 
              alt={`Fin is ${mood}`}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div role="img" aria-label={`Fin the bear ${mood}`} className={`w-full h-full flex items-center justify-center text-2xl ${fallbackColor}`}>
              🐻
            </div>
          )}
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fin the Bear</span>
      </div>

      <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex-1 relative mt-2">
         <div className="absolute top-0 left-0 -ml-2 w-4 h-4 bg-white border-l border-b border-slate-100 transform rotate-45 mt-4"></div>
         <p className="text-sm font-medium text-slate-700 relative z-10 leading-relaxed">
           {message}
         </p>
      </div>
    </div>
  );
};

const SafeToSpendGauge = ({ limit, spent }) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverLimit = spent > limit;
  const color = isOverLimit ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Safe to Spend Today</p>
          <h2 className="text-3xl font-bold text-slate-800">₹{Math.max(limit - spent, 0)}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Daily Limit</p>
          <p className="font-medium text-slate-600">₹{limit}</p>
        </div>
      </div>
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between text-xs font-medium">
        <span className={isOverLimit ? 'text-red-500' : 'text-emerald-600'}>
          {isOverLimit ? '⚠️ Over Budget' : 'On Track'}
        </span>
        <span className="text-slate-400">Spent: ₹{spent}</span>
      </div>
    </div>
  );
};

const SubscriptionManager = ({ subscriptions }) => {
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due0 = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffTime = due0 - today0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="animate-in fade-in pb-24">
      <div className="flex justify-between items-center mb-6 px-4">
         <h2 className="text-2xl font-bold text-slate-800">Subscriptions</h2>
         <button aria-label="Add subscription" className="bg-indigo-100 p-2 rounded-full text-indigo-600">
           <Plus size={20} />
         </button>
      </div>

      <div className="space-y-4 px-4">
        {subscriptions.map((sub) => {
          const daysLeft = getDaysLeft(sub.dueDate);
          const isDueSoon = daysLeft <= 5 && daysLeft >= 0;
          const daysPassedFromCycleStart = Math.max(0, Math.min(30, 30 - daysLeft));
          const percent = Math.max(0, Math.min(100, (daysPassedFromCycleStart / 30) * 100));

          return (
            <div key={sub.id} className={`bg-white p-5 rounded-2xl shadow-sm border ${isDueSoon ? 'border-orange-200 ring-4 ring-orange-50' : 'border-slate-100'} relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${sub.color}`}>
                    {sub.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{sub.name}</h3>
                    <p className="text-xs text-slate-400">Cycle: Monthly</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-slate-800">₹{sub.amount}</span>
                  <span className={`text-[10px] font-bold ${isDueSoon ? 'text-orange-500' : 'text-slate-400'}`}>
                    {daysLeft < 0 ? `Overdue ${Math.abs(daysLeft)}d` : `Due in ${daysLeft} days`}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-50 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className={`h-full ${sub.color} opacity-50`} style={{ width: `${percent}%` }}></div>
              </div>
              {isDueSoon && (
                <div className="mt-3 flex gap-2">
                   <button className="flex-1 bg-orange-50 text-orange-600 py-2 rounded-lg text-xs font-bold">Skip Month</button>
                   <button className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg text-xs font-bold">Details</button>
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-6 bg-indigo-50 p-4 rounded-2xl flex justify-between items-center border border-indigo-100">
           <div className="flex items-center gap-2 text-indigo-800">
             <RefreshCw size={18} />
             <span className="font-bold text-sm">Total Recurring</span>
           </div>
           <span className="font-bold text-xl text-indigo-900">₹{subscriptions.reduce((a,b) => a + b.amount, 0)}</span>
        </div>
      </div>
    </div>
  );
};

// ... For brevity, reuse the rest of your original component implementations (AnalyticsDashboard, SavingsGoalWidget, etc.)
/* To keep this example self-contained, we'll include a simplified AnalyticsDashboard and other small components */

const AnalyticsDashboard = ({ transactions }) => {
  const [filter, setFilter] = useState('Week');
  const totalSpent = transactions.filter(t => t.category !== 'Savings').reduce((acc, t) => acc + t.amount, 0);
  const avgDaily = Math.round(totalSpent / 7);

  const categoryData = useMemo(() => {
    const totals = transactions.reduce((acc, txn) => {
      if (txn.category === 'Savings') return acc;
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});
    const totalSpentVal = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.keys(totals).map(cat => ({
      name: cat,
      amount: totals[cat],
      percent: totalSpentVal ? (totals[cat] / totalSpentVal) * 100 : 0,
      color: cat === 'Food' ? 'bg-orange-400' : 
             cat === 'Travel' ? 'bg-blue-400' : 
             cat === 'Entmt' ? 'bg-purple-400' : 'bg-slate-400'
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const weeklyData = [
    { day: 'M', val: 30 }, { day: 'T', val: 45 }, { day: 'W', val: 25 },
    { day: 'T', val: 75 }, { day: 'F', val: 50 }, { day: 'S', val: 20 }, { day: 'S', val: 10 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.val));

  return (
    <div className="p-4 animate-in fade-in pb-24">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
         <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
           {['Week', 'Month'].map(t => (
             <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-lg transition-all ${filter === t ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>{t}</button>
           ))}
         </div>
       </div>

       <div className="grid grid-cols-2 gap-3 mb-6">
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-1 text-slate-400"><Wallet size={14} /><p className="text-xs font-bold uppercase">Total Spent</p></div>
            <h3 className="text-2xl font-bold text-slate-800">₹{totalSpent}</h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 w-fit px-2 py-1 rounded-md mt-2"><TrendingDown size={10} /> 12% vs last {filter.toLowerCase()}</span>
         </div>
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-1 text-slate-400"><Calendar size={14} /><p className="text-xs font-bold uppercase">Avg / Day</p></div>
            <h3 className="text-2xl font-bold text-slate-800">₹{avgDaily}</h3>
            <span className="text-[10px] text-slate-400 font-medium mt-2 block">Safe limit: ₹1200</span>
         </div>
       </div>

       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
         <div className="flex justify-between items-center mb-6"><h3 className="text-sm font-bold text-slate-700">Weekly Trend</h3><BarChart2 size={16} className="text-slate-300" /></div>
         <div className="h-40 flex items-end justify-between gap-3">
           {weeklyData.map((d, i) => {
             const isPeak = d.val === maxVal;
             return (
               <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">₹{d.val * 10}</div>
                 <div className={`w-full rounded-t-lg transition-all duration-500 ${isPeak ? 'bg-indigo-500' : 'bg-slate-100 group-hover:bg-indigo-200'}`} style={{ height: `${d.val}%` }}></div>
                 <span className={`text-[10px] font-bold ${isPeak ? 'text-indigo-600' : 'text-slate-300'}`}>{d.day}</span>
               </div>
             );
           })}
         </div>
       </div>

       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
         <h3 className="text-sm font-bold text-slate-700 mb-6">Category Split</h3>
         <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center">
                <div className="relative w-32 h-32 rounded-full flex-shrink-0" style={{ background: `conic-gradient(#fb923c ${categoryData[0]?.percent || 0}%, #60a5fa 0 ${ (categoryData[0]?.percent || 0) + (categoryData[1]?.percent || 0) }%, #c084fc 0)` }}>
                   <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
                      <span className="text-xl font-bold text-slate-800">₹{totalSpent}</span>
                   </div>
                </div>
            </div>
            <div className="space-y-4">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${cat.color}`}></div>{cat.name}</div>
                    <span>{Math.round(cat.percent)}% <span className="text-slate-300 font-normal ml-1">(₹{cat.amount})</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }}></div></div>
                </div>
              ))}
            </div>
         </div>
       </div>

       {topCategory && (
         <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-3 items-start">
             <div className="bg-indigo-100 p-2 rounded-full text-xl">🐻</div>
             <div>
                <h4 className="text-xs font-bold text-indigo-800 uppercase mb-1">Fin's Insight</h4>
                <p className="text-sm text-indigo-900 leading-snug">Whoa! <b>{topCategory.name}</b> is eating up {Math.round(topCategory.percent)}% of your budget. Try cutting that by 10% next week?</p>
             </div>
         </div>
       )}
    </div>
  );
};

const SavingsGoalWidget = ({ goal, onAddFunds, onCreate }) => {
  if (!goal) return (<div onClick={onCreate} className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-2xl shadow-sm text-white mb-6 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"><div><h3 className="font-bold text-lg">Create Savings Goal</h3><p className="text-indigo-100 text-xs opacity-90">Save for phone, bike, etc.</p></div><div className="bg-white/20 p-2 rounded-full"><Plus size={24} /></div></div>);
  const percentage = Math.min((goal.saved / goal.target) * 100, 100);
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3"><div className="bg-pink-100 p-2 rounded-xl text-pink-500"><Target size={20} /></div><div><h3 className="font-bold text-slate-800">{goal.name}</h3><p className="text-xs text-slate-400">Target: ₹{goal.target}</p></div></div>
        <div className="text-right"><span className="text-lg font-bold text-indigo-600">₹{goal.saved}</span></div>
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-3"><div className="h-full bg-pink-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div></div>
      <div className="flex justify-between items-center"><span className="text-xs text-slate-400">{Math.round(percentage)}% Achieved</span><button onClick={() => onAddFunds(500)} className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg font-medium active:scale-95 transition-transform">+ Add ₹500</button></div>
      {percentage >= 100 && (<div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white animate-in fade-in"><Trophy size={40} className="text-yellow-400 mb-2" /><h3 className="font-bold text-xl">Goal Reached!</h3><p className="text-sm text-slate-300">Great job saving.</p></div>)}
    </div>
  );
};

const AddTransactionModal = ({ show, onClose, onSave }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    if (show) {
      // focus management could go here
    } else {
      setAmount('');
      setCategory('Food');
    }
  }, [show]);

  if (!show) return null;

  const categories = [
    { id: 'Food', label: 'Food', color: 'bg-orange-100 text-orange-600' },
    { id: 'Travel', label: 'Travel', color: 'bg-blue-100 text-blue-600' },
    { id: 'Entmt', label: 'Entertainment', color: 'bg-purple-100 text-purple-600' },
    { id: 'Shopping', label: 'Shopping', color: 'bg-pink-100 text-pink-600' },
    { id: 'Bills', label: 'Bills', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'Other', label: 'Other', color: 'bg-slate-100 text-slate-600' }
  ];

  const handleSubmit = () => {
    const parsed = parseInt(amount, 10);
    if (!parsed || parsed <= 0) return;
    onSave(parsed, category);
    setAmount('');
    setCategory('Food');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Add Spending</h3>
          <button onClick={onClose} aria-label="Close"><X size={24} className="text-slate-400" /></button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
              <input 
                autoFocus
                aria-label="Amount in rupees"
                type="number" 
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-10 text-2xl font-bold text-slate-800 focus:outline-indigo-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${category === cat.id ? 'ring-2 ring-offset-1 ring-indigo-500 ' + cat.color : 'bg-slate-50 text-slate-500'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Check size={20} /> Save Expense
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationOverlay = ({ show, data, onClose, onReply, onSaveToGoal }) => {
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  useEffect(() => { if (!show) { setIsCustomInput(false); setCustomValue(''); } }, [show]);
  if (!show) return null;
  if (data.type === 'credit') {
    const saveAmount = Math.floor(data.amount * 0.10); 
    const goalName = data.goalName || 'your goal';
    return (
      <div className="fixed top-0 left-0 right-0 z-50 p-2">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-w-md mx-auto ring-4 ring-emerald-50">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-start"><div className="flex gap-3"><div className="bg-emerald-100 p-2 rounded-full text-emerald-600 h-10 w-10 flex items-center justify-center"><PiggyBank size={20} /></div><div><h4 className="font-bold text-slate-800">₹{data.amount} Credited!</h4><p className="text-sm text-slate-600">Great job! Want to save for <b>{goalName}</b>?</p></div></div><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button></div>
          <div className="p-3 bg-white flex gap-2"><button onClick={() => onSaveToGoal(saveAmount)} className="flex-1 bg-emerald-600 text-white py-3 px-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">Yes, Save ₹{saveAmount}</button><button onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 py-3 px-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Maybe Later</button></div>
        </div>
      </div>
    );
  }
  const handleCategoryClick = (cat) => { if (cat === 'Other') { setIsCustomInput(true); } else { onReply(cat); } };
  const handleCustomSubmit = () => { if (customValue.trim()) { onReply(customValue); } };
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-w-md mx-auto">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start"><div className="flex gap-3"><div className="bg-orange-100 p-2 rounded-full text-orange-600 h-10 w-10 flex items-center justify-center"><Wallet size={20} /></div><div><h4 className="font-bold text-slate-800">₹{data.amount} Debited</h4><p className="text-sm text-slate-500">{data.msg}</p></div></div><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button></div>
        <div className="p-3 bg-white">
          {!isCustomInput ? (<><p className="text-xs font-bold text-slate-400 px-1 mb-2 uppercase">Select Category:</p><div className="grid grid-cols-4 gap-2">{['Food', 'Travel', 'Entmt', 'Other'].map((cat) => (<button key={cat} onClick={() => handleCategoryClick(cat)} className="py-2 px-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition-colors">{cat}</button>))}</div></>) : (<><p className="text-xs font-bold text-slate-400 px-1 mb-2 uppercase">Enter Category:</p><div className="flex gap-2"><input autoFocus type="text" placeholder="e.g. Medical, Rent..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={customValue} onChange={(e) => setCustomValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()} /><button onClick={handleCustomSubmit} disabled={!customValue.trim()} className="bg-indigo-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"><ArrowRight size={20} /></button></div></>)}
        </div>
      </div>
    </div>
  );
};

const CreateGoalModal = ({ show, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  useEffect(() => { if (!show) { setName(''); setAmount(''); } }, [show]);
  if (!show) return null;
  return (<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-800">New Goal</h3><button onClick={onClose}><X size={24} className="text-slate-400" /></button></div><div className="space-y-4"><div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Goal Name</label><input type="text" placeholder="e.g. New Headphones" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1 focus:outline-indigo-500" value={name} onChange={(e) => setName(e.target.value)} /></div><div><label className="text-xs font-bold text-slate-500 uppercase ml-1">Target Amount (₹)</label><input type="number" placeholder="4000" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1 focus:outline-indigo-500" value={amount} onChange={(e) => setAmount(e.target.value)} /></div><button onClick={() => { const parsed = parseInt(amount,10) || 0; onSave(name, parsed); }} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-indigo-200 active:scale-95 transition-transform">Start Saving</button></div></div></div>);
};

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Zomato', amount: 450, category: 'Food', date: 'Today, 2:30 PM' },
    { id: 2, title: 'Uber', amount: 230, category: 'Travel', date: 'Today, 9:00 AM' },
    { id: 3, title: 'PVR Cinemas', amount: 300, category: 'Entmt', date: 'Yesterday' },
    { id: 4, title: 'Swiggy', amount: 120, category: 'Food', date: 'Yesterday' },
  ]);

  const [notification, setNotification] = useState({ show: false, amount: 0, msg: '', type: 'debit' });
  const [spentToday, setSpentToday] = useState(680); 
  const DAILY_LIMIT = 1200;
  const [activeGoal, setActiveGoal] = useState({ name: 'Headphones', target: 4000, saved: 1500 }); 
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAddTxnModal, setShowAddTxnModal] = useState(false);
  const [mascotState, setMascotState] = useState({ mood: 'happy', msg: "Good job staying under budget today!", isAnimating: false });

  const mascotTimeoutRef = useRef(null);
  useEffect(() => {
    return () => { if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current); };
  }, []);

  const [subscriptions] = useState([
    { id: 1, name: 'Netflix', amount: 649, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), color: 'bg-red-500' },
    { id: 2, name: 'Spotify', amount: 119, dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), color: 'bg-green-500' },
    { id: 3, name: 'iCloud', amount: 75, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), color: 'bg-blue-500' }
  ]);

  const startMascotAnimation = (newState) => {
    setMascotState({ ...newState, isAnimating: true });
    if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
    mascotTimeoutRef.current = setTimeout(() => {
      setMascotState(prev => ({ ...prev, isAnimating: false }));
      mascotTimeoutRef.current = null;
    }, 5000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'subs') {
      const upcoming = subscriptions.filter(s => {
        const diff = new Date(s.dueDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days <= 5;
      });

      if (upcoming.length > 0) {
        startMascotAnimation({
          mood: 'concerned',
          msg: `Warning! ${upcoming[0].name} is due in a few days. Do you really need it this month?`
        });
      } else {
        startMascotAnimation({
          mood: 'happy',
          msg: "No bills due this week! Your wallet is safe... for now."
        });
      }
    }
  };

  useEffect(() => {
    if (!mascotState.isAnimating && activeTab === 'home') {
        const usage = spentToday / DAILY_LIMIT;
        if (usage < 0.5) {
           setMascotState(prev => ({ ...prev, mood: 'happy', msg: "Smooth sailing! You're saving well." }));
        } else if (usage >= 0.5 && usage < 1.0) {
           setMascotState(prev => ({ ...prev, mood: 'concerned', msg: "Careful! We've used over half the budget." }));
        } else {
           setMascotState(prev => ({ ...prev, mood: 'angry', msg: "STOP! We are out of money for today!" }));
        }
    }
  }, [spentToday, DAILY_LIMIT, activeTab, mascotState.isAnimating]);

  const triggerFakeSMS = () => {
    const isCredit = Math.random() > 0.5;
    if (isCredit) {
      const amount = Math.floor(Math.random() * 5000) + 1200;
      setNotification({ show: true, type: 'credit', amount: amount, goalName: activeGoal ? activeGoal.name : 'future', msg: `Credited INR ${amount} to A/C XX1234` });
    } else {
      const amount = Math.floor(Math.random() * 500) + 50;
      setNotification({ show: true, type: 'debit', amount: amount, msg: `Debited INR ${amount} from A/C XX1234` });
    }
  };

  const handleNotificationReply = (category) => {
    processTransaction(notification.amount, category);
    setNotification({ ...notification, show: false });
  };

  const handleAddManualTxn = (amount, category) => {
    processTransaction(parseInt(amount, 10), category);
    setShowAddTxnModal(false);
  };

  const processTransaction = (amount, category) => {
    const newTxn = { id: Date.now(), title: category, amount: amount, category: category, date: 'Just Now' };
    setTransactions(prev => [newTxn, ...prev]);
    setSpentToday(prev => prev + amount);

    let newMood = 'happy';
    let newMsg = "Expense tracked.";

    if (category === 'Entmt' || category === 'Shopping') {
        newMood = 'angry';
        const goldEquivalent = (amount / 6000).toFixed(2);
        const sharesEquivalent = Math.floor(amount / 50);
        const highSpendAdvices = [
            `Ouch! ₹${amount}? You could have bought ${goldEquivalent}g of Gold instead!`,
            `Put this ₹${amount} in a SIP, and it could've been ₹${Math.floor(amount * 1.6)} in 5 years.`
        ];
        const lowSpendAdvices = [
            `Bro, that's ${sharesEquivalent} shares of a penny stock gone. Was it worth it?`,
            `That's ${Math.floor(amount / 10)} days of mobile data you just burned.`
        ];
        newMsg = amount > 500 ? highSpendAdvices[Math.floor(Math.random() * highSpendAdvices.length)] : lowSpendAdvices[Math.floor(Math.random() * lowSpendAdvices.length)];
    } else if (category === 'Travel' && amount > 300) {
        newMood = 'concerned';
        newMsg = "That's a pricey ride. Could we have taken the bus?";
    } else if ((spentToday + amount) > DAILY_LIMIT) {
        newMood = 'angry';
        newMsg = "That's it! We are officially BROKE for today.";
    }

    startMascotAnimation({ mood: newMood, msg: newMsg });
  };

  const handleSaveToGoal = (amountToSave) => {
    if (activeGoal) {
      setActiveGoal(prev => ({ ...prev, saved: prev.saved + amountToSave }));
      setNotification({ ...notification, show: false });
      startMascotAnimation({ mood: 'excited', msg: `WOOHOO! ₹${amountToSave} saved! I'm so proud of us!` });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 max-w-md mx-auto border-x border-slate-200 relative">
      <NotificationOverlay show={notification.show} data={notification} onClose={() => setNotification({ ...notification, show: false })} onReply={handleNotificationReply} onSaveToGoal={handleSaveToGoal} />
      <CreateGoalModal show={showGoalModal} onClose={() => setShowGoalModal(false)} onSave={(n, a) => { setActiveGoal({ name: n, target: parseInt(a, 10), saved: 0 }); setShowGoalModal(false); }} />
      <AddTransactionModal show={showAddTxnModal} onClose={() => setShowAddTxnModal(false)} onSave={handleAddManualTxn} />

      <header className="bg-white px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div><p className="text-slate-500 text-sm">Good Evening,</p><h1 className="text-2xl font-bold text-slate-800">Ramesh Kumar</h1></div>
          <button onClick={triggerFakeSMS} aria-label="Simulate incoming SMS" className="bg-indigo-100 text-indigo-600 p-2 rounded-full active:scale-95 transition-transform" title="Simulate SMS Receipt"><MessageSquare size={20} /></button>
        </div>
      </header>

      <main className="p-4">
        <MascotWidget mood={mascotState.mood} message={mascotState.msg} isAnimating={mascotState.isAnimating} />

        {activeTab === 'home' && (
          <>
            <SafeToSpendGauge limit={DAILY_LIMIT} spent={spentToday} />
            <div className="mb-2">
               <div className="flex justify-between items-center mb-2 px-1"><h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">My Goals</h3>{activeGoal && <button onClick={() => setActiveGoal(null)} className="text-xs text-red-400">Reset</button>}</div>
               <SavingsGoalWidget goal={activeGoal} onCreate={() => setShowGoalModal(true)} onAddFunds={(amt) => setActiveGoal(prev => ({...prev, saved: prev.saved + amt}))} />
            </div>
            <div className="flex justify-between items-center mb-3"><h3 className="font-bold text-slate-800">Recent Activity</h3><button className="text-indigo-600 text-sm font-medium">See All</button></div>
            <div className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${txn.category === 'Food' ? 'bg-orange-100 text-orange-600' : txn.category === 'Travel' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>{txn.category === 'Food' ? '🍔' : txn.category === 'Travel' ? '🚕' : '🛍️'}</div>
                    <div><h4 className="font-bold text-slate-700">{txn.title}</h4><p className="text-xs text-slate-400">{txn.date} • {txn.category}</p></div>
                  </div>
                  <span className="font-bold text-slate-800">-₹{txn.amount}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'subs' && <SubscriptionManager subscriptions={subscriptions} />}

        {activeTab === 'analytics' && <AnalyticsDashboard transactions={transactions} />}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center max-w-md mx-auto z-20">
        <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button onClick={() => handleTabChange('subs')} className={`flex flex-col items-center gap-1 ${activeTab === 'subs' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <RefreshCw size={24} strokeWidth={activeTab === 'subs' ? 3 : 2} />
          <span className="text-[10px] font-medium">Subs</span>
        </button>

        <button onClick={() => handleTabChange('analytics')} className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <PieChartIcon size={24} strokeWidth={activeTab === 'analytics' ? 3 : 2} />
          <span className="text-[10px] font-medium">Analysis</span>
        </button>
      </div>
    </div>
  );
}
