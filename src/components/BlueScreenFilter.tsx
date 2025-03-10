import type React from 'react';
import { useState, useEffect } from 'react';

const BlueScreenFilter: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial state when component mounts
        fetchState();
    }, []);

    const fetchState = () => {
        setIsLoading(true);
        chrome.runtime.sendMessage(
            { type: 'getBlueScreenState' },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error(
                        'Error getting state:',
                        chrome.runtime.lastError.message,
                    );
                } else {
                    console.log('Received state from background:', response);
                    setIsActive(response?.isActive || false);
                }
                setIsLoading(false);
            },
        );
    };

    const toggleBlueScreen = () => {
        setIsLoading(true);
        console.log('Sending toggle request to background');
        chrome.runtime.sendMessage({ type: 'toggleBlueScreen' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(
                    'Error sending message to background:',
                    chrome.runtime.lastError.message,
                );
            } else {
                console.log('Background response:', response);
                if (response?.success) {
                    setIsActive(response.isActive);
                }
            }
            setIsLoading(false);
        });
    };

    return (
        <div className="p-4 w-64">
            <h1 className="text-lg font-bold mb-4">Blue Screen Filter</h1>
            <button
                type="button"
                onClick={toggleBlueScreen}
                disabled={isLoading}
                className={`${isActive ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading
                    ? 'Loading...'
                    : isActive
                      ? 'Disable Blue Screen'
                      : 'Enable Blue Screen'}
            </button>
        </div>
    );
};

export default BlueScreenFilter;
