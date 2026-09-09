
import { useState, useEffect, useRef } from 'react';


const AdvancedCounter = () => {
    const [count, setCount] = useState<number>(() => {
        const storedCount = localStorage.getItem('count');
        return storedCount ? parseInt(storedCount, 10) : 0;
    });
    const [step, setStep] = useState<number>(1);
    const [counts, setCounts] = useState<number[]>([0]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const isInitialRender = useRef(true);

    // function handleIncrement() {
    //     setCount(prevCount => {
    //         const newCount = prevCount + step;
    //         setCounts(prevCounts => [...prevCounts, newCount]);
    //         return newCount;
    //     });
    //     setSavedCount('Changes saved.');
    // }

    function handleIncrement() {
        setCount(prevCount => prevCount + step);
        setCounts(prevCounts => [...prevCounts, count + step]);
        setIsSaving(true);
    }

    function handleDecrement() {
        setCount(prevCount => prevCount - step);
        setCounts(prevCounts => [...prevCounts, count - step]);
        setIsSaving(true);
    }

    function handleStepChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newStep = parseInt(event.target.value, 10);
        setStep(isNaN(newStep) ? 1 : newStep);
    }

    function handleReset() {
        setCount(0);
        setCounts([0]);
        setStep(1);
        setIsSaving(true);
    }


    useEffect(() => {

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'ArrowUp') {
                handleIncrement();
            } else if (event.key === 'ArrowDown') {
                handleDecrement();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [step]);

    useEffect(() => {
       
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }


        const timer = setTimeout(() => {
            localStorage.setItem('count', count.toString());
            setIsSaving(false);
        }, 500);

        

        return () => {
            clearTimeout(timer);
        };
    }, [count]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 text-slate-700 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-8 max-w-md w-full shadow-xl shadow-purple-100/50 space-y-6">
                
                {/* Title and count */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-purple-900/80">Advanced Counter</h2>
                    <div className="text-7xl font-black text-purple-600/90 my-2 tracking-tight">
                        {count}
                    </div>
                    
                    {/* Status of saving */}
                    <div className="h-6 flex items-center justify-center">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                            isSaving 
                                ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse' 
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                            {isSaving ? 'Saving changes...' : 'Changes saved'}
                        </span>
                    </div>
                </div>

                {/* Step Configuration */}
                <div className="flex items-center justify-between bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                    <label htmlFor="step-input" className="text-sm font-semibold text-purple-800/70">
                        Step Value:
                    </label>
                    <input 
                        id="step-input"
                        type="number"
                        value={step}
                        onChange={handleStepChange}
                        className="w-20 bg-white border border-purple-200 text-center text-purple-900 font-bold rounded-xl py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all shadow-sm"
                    />
                </div>

                {/* Main Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={handleIncrement}
                        className="bg-purple-200 hover:bg-purple-300 active:scale-95 text-purple-900 font-bold py-3.5 px-4 rounded-full transition-all shadow-sm hover:shadow"
                    >
                        + Increment
                    </button>
                    <button 
                        onClick={handleDecrement}
                        className="bg-pink-100 hover:bg-pink-200 active:scale-95 text-pink-900 font-bold py-3.5 px-4 rounded-full transition-all shadow-sm hover:shadow"
                    >
                        - Decrement
                    </button>
                </div>

                {/* Reset Button */}
                <button 
                    onClick={handleReset}
                    className="w-full bg-rose-50 hover:bg-rose-100 active:scale-98 text-rose-600 border border-rose-200/60 font-semibold py-2.5 px-4 rounded-full transition-all text-sm"
                >
                    Reset Counter
                </button>

                {/* Count History */}
                <div className="pt-4 border-t border-purple-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Count History ({counts.length})
                    </h3>
                    <div className="h-28 overflow-y-scroll pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 hover:scrollbar-thumb-purple-300 transition-colors rounded-2xl">
                        {counts.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                <ul>
                                    {counts.map((c, index) => (
                                        <li key={index}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                            ) : (
                                <p className="text-xs text-purple-300">No counts recorded.</p>
                            )}                           
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="pt-4 border-t border-purple-100/80 flex items-center justify-center gap-2 text-xs text-purple-400 font-medium">
                    <span>Tip: Use</span>
                    <kbd className="px-2 py-0.5 bg-purple-50 border border-purple-200/80 rounded-md text-purple-600 font-mono text-[10px] shadow-sm">↑</kbd>
                    <kbd className="px-2 py-0.5 bg-purple-50 border border-purple-200/80 rounded-md text-purple-600 font-mono text-[10px] shadow-sm">↓</kbd>
                    <span>on your keyboard</span>
                </div>

            </div>
        </div>


        // <div>
        //     <h2>Advanced Counter</h2>
        //     <p>Count: {count}</p>
        //     <p>Step: {step}</p>
        //     <button onClick={handleIncrement}>Increment</button>
        //     <button onClick={handleDecrement}>Decrement</button>
        //     <input 
        //         type="number"
        //         value={step}
        //         onChange={handleStepChange}
        //     />
        //     <button onClick={handleReset}>Reset</button>
        //     <p>{isSaving ? 'Saving changes...' : 'Changes saved.'}</p>
        //     <h3>Count History:</h3>
        //    {counts.length > 0 ? (
        //        <ul>
        //            {counts.map((c, index) => (
        //                <li key={index}>{c}</li>
        //            ))}
        //        </ul>
        //    ) : (
        //        <p>No counts recorded.</p>
        //    )}
        // </div>
    )
}

export default AdvancedCounter;