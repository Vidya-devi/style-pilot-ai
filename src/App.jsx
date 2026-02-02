import { useState, useEffect } from 'react';

// Quiz Data
const quizData = [
    {
        question: "What's your style vibe?",
        options: ["Casual & Comfy", "Professional", "Trendy", "Classic", "Sporty", "Bohemian"]
    },
    {
        question: "Favorite colors?",
        options: ["Neutrals (Black, White, Grey)", "Earth Tones", "Bold & Bright", "Pastels", "Monochromes"]
    },
    {
        question: "What occasions do you dress for most?",
        options: ["Work/Office", "Casual Hangouts", "Dates", "Gym/Sports", "Formal Events"]
    },
    {
        question: "Preferred fit?",
        options: ["Relaxed & Loose", "Fitted", "Tailored", "Oversized", "Mixed"]
    },
    {
        question: "Body type? (Optional)",
        options: ["Athletic", "Curvy", "Petite", "Tall", "Plus Size", "Skip"]
    }
];

// Wardrobe Data
const wardrobeData = {
    tops: [
        { name: "White T-Shirt", icon: "👕", occasions: ["casual", "all"], colors: ["neutral"] },
        { name: "Black Blouse", icon: "👚", occasions: ["work", "date", "all"], colors: ["neutral"] },
        { name: "Striped Shirt", icon: "👔", occasions: ["casual", "work", "all"], colors: ["neutral"] },
        { name: "Crop Top", icon: "🎽", occasions: ["casual", "date", "all"], colors: ["bold"] },
        { name: "Sweater", icon: "🧥", occasions: ["casual", "all"], colors: ["earth", "neutral"] },
        { name: "Blazer", icon: "🧥", occasions: ["work", "formal", "all"], colors: ["neutral"] }
    ],
    bottoms: [
        { name: "Blue Jeans", icon: "👖", occasions: ["casual", "all"], colors: ["neutral"] },
        { name: "Black Trousers", icon: "👔", occasions: ["work", "formal", "all"], colors: ["neutral"] },
        { name: "Skirt", icon: "👗", occasions: ["work", "date", "formal", "all"], colors: ["all"] },
        { name: "Shorts", icon: "🩳", occasions: ["casual", "all"], colors: ["all"] },
        { name: "Leggings", icon: "🩱", occasions: ["casual", "all"], colors: ["neutral"] }
    ],
    shoes: [
        { name: "Sneakers", icon: "👟", occasions: ["casual", "all"], colors: ["all"] },
        { name: "Heels", icon: "👠", occasions: ["work", "date", "formal", "all"], colors: ["all"] },
        { name: "Boots", icon: "🥾", occasions: ["casual", "work", "all"], colors: ["earth", "neutral"] },
        { name: "Flats", icon: "🥿", occasions: ["casual", "work", "all"], colors: ["all"] },
        { name: "Sandals", icon: "👡", occasions: ["casual", "all"], colors: ["all"] }
    ],
    accessories: [
        { name: "Watch", icon: "⌚", occasions: ["all"], colors: ["all"] },
        { name: "Sunglasses", icon: "🕶️", occasions: ["casual", "all"], colors: ["all"] },
        { name: "Hat", icon: "🎩", occasions: ["casual", "all"], colors: ["all"] },
        { name: "Scarf", icon: "🧣", occasions: ["all"], colors: ["all"] },
        { name: "Bag", icon: "👜", occasions: ["all"], colors: ["all"] }
    ]
};

export default function App() {
    const [appState, setAppState] = useState('quiz'); // 'quiz' or 'app'
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userProfile, setUserProfile] = useState({});
    const [currentOutfit, setCurrentOutfit] = useState({
        top: null,
        bottom: null,
        shoes: null,
        accessory: null
    });
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [currentOccasion, setCurrentOccasion] = useState('all');
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        const keys = ['styleVibe', 'colors', 'occasions', 'fit', 'bodyType'];
        setUserProfile(prev => ({
            ...prev,
            [keys[currentQuestion]]: option
        }));
    };

    const handleNextQuestion = () => {
        if (!selectedOption) {
            alert('Please select an option!');
            return;
        }

        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null); // Reset selection
        } else {
            setAppState('app');
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            // Restore previous selection if possible? 
            // For simplicity, we might reset or try to find it from userProfile.
            // Let's reset for now or read from profile.
            const keys = ['styleVibe', 'colors', 'occasions', 'fit', 'bodyType'];
            const prevKey = keys[currentQuestion - 1];
            setSelectedOption(userProfile[prevKey]);
        }
    }

    const resetApp = () => {
        if (confirm('Start over with a new style profile?')) {
            setAppState('quiz');
            setCurrentQuestion(0);
            setUserProfile({});
            setCurrentOutfit({ top: null, bottom: null, shoes: null, accessory: null });
            setSavedOutfits([]);
            setSelectedOption(null);
        }
    };

    const addToOutfit = (category, item) => {
        const slotMap = {
            tops: 'top',
            bottoms: 'bottom',
            shoes: 'shoes',
            accessories: 'accessory'
        };

        const slot = slotMap[category];
        if (slot) {
            setCurrentOutfit(prev => ({
                ...prev,
                [slot]: item
            }));
        }
    };

    const removeFromOutfit = (slot) => {
        setCurrentOutfit(prev => ({
            ...prev,
            [slot]: null
        }));
    };

    const calculateStyleScore = () => {
        let score = 0;
        const filledSlots = Object.values(currentOutfit).filter(item => item !== null).length;
        score += filledSlots * 20;

        if (currentOutfit.top && currentOutfit.bottom) {
            score += 20;
        }
        return score;
    }

    const saveOutfit = () => {
        const filledSlots = Object.values(currentOutfit).filter(item => item !== null);
        if (filledSlots.length < 2) {
            alert('Add at least 2 items to save an outfit!');
            return;
        }

        setSavedOutfits(prev => [...prev, { ...currentOutfit }]);
        alert('Outfit saved! ✨');
    };

    const loadOutfit = (index) => {
        setCurrentOutfit({ ...savedOutfits[index] });
    };

    const deleteOutfit = (index) => {
        setSavedOutfits(prev => prev.filter((_, i) => i !== index));
    }

    // Derived state for suggestions
    const getSuggestions = () => {
        const suggestions = [];

        if (currentOutfit.top && !currentOutfit.bottom) {
            suggestions.push({
                title: "🎯 Complete this look with...",
                type: 'bottoms',
                items: wardrobeData.bottoms
            });
        }

        if (currentOutfit.top && currentOutfit.bottom && !currentOutfit.shoes) {
            suggestions.push({
                title: "👟 Perfect shoes for this outfit...",
                type: 'shoes',
                items: wardrobeData.shoes.slice(0, 3)
            });
        }

        if (Object.values(currentOutfit).filter(item => item !== null).length === 3 && !currentOutfit.accessory) {
            suggestions.push({
                title: "✨ Accessorize it!",
                type: 'accessories',
                items: wardrobeData.accessories
            });
        }

        return suggestions;
    }

    return (
        <div className="container">
            <header>
                <h1>✨ StylePilot AI</h1>
                <p className="tagline">Your Personal Fashion Recommendation Assistant</p>
            </header>

            <div className="main-content">
                {appState === 'quiz' ? (
                    <div className="quiz-container" id="quizContainer">
                        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Let's Create Your Style Profile</h2>

                        <div className="quiz-question">
                            <h3>Question {currentQuestion + 1} of {quizData.length}</h3>
                            <h3>{quizData[currentQuestion].question}</h3>
                            <div className="options">
                                {quizData[currentQuestion].options.map(option => (
                                    <button
                                        key={option}
                                        className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
                                        onClick={() => handleOptionSelect(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-nav">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePrevQuestion}
                                style={{ display: currentQuestion > 0 ? 'block' : 'none' }}
                            >
                                Previous
                            </button>
                            <button className="btn btn-primary" onClick={handleNextQuestion}>
                                {currentQuestion === quizData.length - 1 ? 'Start Styling!' : 'Next'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="app-container" id="appContainer" style={{ display: 'block' }}>
                        <div className="app-header">
                            <h2>Build Your Perfect Outfit</h2>
                            <div className="user-profile">
                                <span className="profile-badge">{userProfile.styleVibe} Style</span>
                                <button className="btn btn-secondary" onClick={resetApp}>New Profile</button>
                            </div>
                        </div>

                        <div className="occasion-filter">
                            {['all', 'casual', 'work', 'date', 'formal'].map(occ => (
                                <button
                                    key={occ}
                                    className={`filter-btn ${currentOccasion === occ ? 'active' : ''}`}
                                    data-occasion={occ}
                                    onClick={() => setCurrentOccasion(occ)}
                                >
                                    {occ === 'all' ? 'All' : occ.charAt(0).toUpperCase() + occ.slice(1)}
                                    {occ === 'date' ? ' Night' : ''}
                                </button>
                            ))}
                        </div>

                        <div className="app-grid">
                            {/* Wardrobe */}
                            <div className="wardrobe-panel">
                                {Object.keys(wardrobeData).map(category => (
                                    <div key={category} className="category">
                                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                                        <div className="items-grid">
                                            {wardrobeData[category]
                                                .filter(item => currentOccasion === 'all' || item.occasions.includes(currentOccasion))
                                                .map((item, idx) => (
                                                    <div key={idx} className="clothing-item" onClick={() => addToOutfit(category, item)}>
                                                        <div className="item-icon">{item.icon}</div>
                                                        <div className="item-name">{item.name}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Outfit Builder */}
                            <div className="outfit-builder">
                                <div className="style-score">
                                    <div className="score-value">{calculateStyleScore()}</div>
                                    <div className="score-label">Style Score</div>
                                </div>
                                <div className="outfit-display">
                                    {[
                                        { key: 'top', label: 'Top', icon: '👕' },
                                        { key: 'bottom', label: 'Bottom', icon: '👖' },
                                        { key: 'shoes', label: 'Shoes', icon: '👟' },
                                        { key: 'accessory', label: 'Accessory', icon: '⌚' }
                                    ].map(slot => (
                                        <div key={slot.key} className={`outfit-slot ${currentOutfit[slot.key] ? 'filled' : ''}`}>
                                            {currentOutfit[slot.key] ? (
                                                <>
                                                    <div className="slot-icon">{currentOutfit[slot.key].icon}</div>
                                                    <div className="slot-item">{currentOutfit[slot.key].name}</div>
                                                    <button className="remove-btn" onClick={() => removeFromOutfit(slot.key)}>Remove</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="slot-icon">{slot.icon}</div>
                                                    <div className="slot-label">Add {slot.label}</div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={saveOutfit}>💾 Save Outfit</button>
                            </div>

                            {/* Suggestions */}
                            <div className="suggestions-panel">
                                <h3>💡 Smart Suggestions</h3>
                                <div>
                                    {getSuggestions().map((sugg, idx) => (
                                        <div key={idx} className="suggestion-card">
                                            <div className="suggestion-title">{sugg.title}</div>
                                            <div className="suggestion-items">
                                                {sugg.items.map((item, i) => (
                                                    <span
                                                        key={i}
                                                        className="suggestion-item"
                                                        onClick={() => addToOutfit(sugg.type, item)}
                                                    >
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="saved-outfits">
                                    <h3>📌 Saved Outfits</h3>
                                    <div>
                                        {savedOutfits.length === 0 ? (
                                            <div className="empty-state">No saved outfits yet</div>
                                        ) : (
                                            savedOutfits.map((outfit, index) => (
                                                <div key={index} className="saved-outfit">
                                                    <div>Outfit {index + 1}: {Object.values(outfit).filter(i => i).map(i => i.icon).join(' ')}</div>
                                                    <div className="outfit-actions">
                                                        <button className="action-btn load-btn" onClick={() => loadOutfit(index)}>Load</button>
                                                        <button className="action-btn delete-btn" onClick={() => deleteOutfit(index)}>Delete</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
