
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
        <div>
            <h2>Advanced Counter</h2>
            <p>Count: {count}</p>
            <p>Step: {step}</p>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
            <input 
                type="number"
                value={step}
                onChange={handleStepChange}
            />
            <button onClick={handleReset}>Reset</button>
            <p>{isSaving ? 'Saving changes...' : 'Changes saved.'}</p>
            <h3>Count History:</h3>
            {counts.length > 0 ? (
                <ul>
                    {counts.map((c, index) => (
                        <li key={index}>{c}</li>
                    ))}
                </ul>
            ) : (
                <p>No counts recorded.</p>
            )}
        </div>
    )
}

export default AdvancedCounter;