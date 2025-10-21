import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import ThreeBackground from '../components/home/ThreeBackground';
import GameArenaBackground from '../components/home/GameArenaBackground';
import CyberButton from '../components/home/CyberButton';
import FuturisticGlitchPopup from '../components/home/FuturisticGlitchPopup';
import ComingSoonGlitchPopup from '../components/home/ComingSoonGlitchPopup';
import buttonClickSound from '../assets/mp3/button-click.mp3';

// Update the games array to include route information
const games = [
    { 
        id: 1, 
        title: 'SQL Bureau of Investigation', 
        description: 'Database mystery solving game', 
        image: 'https://images.pexels.com/photos/8761562/pexels-photo-8761562.jpeg?auto=compress&cs=tinysrgb&w=800', 
        color: '#00D9FF',
        route: '#',
        isComingSoon: true // Flag for unavailable games
    },
    { 
        id: 2, 
        title: 'Battleground', 
        description: 'Tactical FPS combat simulator', 
        image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=800', 
        color: '#00D9FF',
        route: 'https://battleground.datasenseai.com/start',
        isExternal: true // Flag for external URLs
    },
    { 
        id: 3, 
        title: '⁠Data Analytics Journey', 
        description: 'Strategic data journey game', 
        image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800', 
        color: '#00D9FF',
        route: '/unity-games',
        isExternal: false
    },
    { 
        id: 4, 
        title: 'AI ML', 
        description: 'AI training simulation', 
        image: 'https://images.pexels.com/photos/7034287/pexels-photo-7034287.jpeg?auto=compress&cs=tinysrgb&w=800', 
        color: '#00D9FF',
        route: '#',
        isComingSoon: true
    },
    { 
        id: 5, 
        title: '⁠SQL Slot Machine', 
        description: 'Advanced SQL puzzle solver', 
        image: 'https://images.pexels.com/photos/8728382/pexels-photo-8728382.jpeg?auto=compress&cs=tinysrgb&w=800', 
        color: '#00D9FF',
        route: 'https://datasenseai.com/unity-games',
        isExternal: true // Flag for external URLs
    }
];

const FixedThreeBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
        {/* <ThreeBackground /> */}
        <GameArenaBackground />
    </div>
);

const RotatingSubheading = () => {
    const subheadings = [
        'TACTICAL FPS COMBAT SIMULATOR - MASTER YOUR REFLEXES',
        'DATABASE MYSTERY SOLVING - CRACK THE SQL CODE',
        'STRATEGIC DATA JOURNEY - NAVIGATE THE ANALYTICS PATH',
        'AI TRAINING SIMULATION - NEURAL NETWORK MASTERY',
        'ADVANCED SQL PUZZLE SOLVER - QUANTUM QUERY CHALLENGE'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsBlinking(true);
            
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % subheadings.length);
                setIsBlinking(false);
            }, 300); // Blink duration
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <p className={`text-sm md:text-base font-mono text-white tracking-wider transition-opacity duration-300 ${isBlinking ? 'opacity-0' : 'opacity-100'}`}>
            {subheadings[currentIndex]}
        </p>
    );
};

export default function GamesArena() {
    // const carouselStyles = `
    //   .fn_cs_slider_wrapper ul { list-style-type: none; margin: 0; padding: 0; position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; }
    //   .fn_cs_slider_wrapper li { 
    //     width: 33.3333%; 
    //     position: absolute; 
    //     margin: 0; 
    //     transform: translateX(100%) scale(0); 
    //     opacity: 0; 
    //     transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
    //     display: flex; 
    //     justify-content: center; 
    //   }
    //   .fn_cs_slider_wrapper li.hidden_card { display: none; }
    //   .fn_cs_slider_wrapper li.prev, .fn_cs_slider_wrapper li.next, .fn_cs_slider_wrapper li.active { transform: translateX(0) scale(1); opacity: 1; }
    //   .fn_cs_slider_wrapper li.prev { left: -40px; z-index: 5; }
    //   .fn_cs_slider_wrapper li.active { left: 33.3333%; z-index: 10; }
    //   .fn_cs_slider_wrapper li.next { left: calc(66.6666% + 40px); z-index: 5; }
    //   .fn_cs_slider_wrapper .item { perspective: 1000px; }
    //   .fn_cs_slider_wrapper .item_in { transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1); }
    //   .fn_cs_slider_wrapper .active .item_in { transform: scale(1.1); }
    //   .fn_cs_slider_wrapper .prev .item_in { transform: scale(0.9) rotateY(30deg); }
    //   .fn_cs_slider_wrapper .next .item_in { transform: scale(0.9) rotateY(-30deg); }
    // `;

    const carouselStyles = `
  .fn_cs_slider_wrapper ul { 
    list-style-type: none; 
    margin: 0; 
    padding: 0; 
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }
  /* Slightly wider slot per card so side cards do not appear compressed */
  .fn_cs_slider_wrapper li { 
    width: 34%; 
    position: absolute; 
    margin: 0; 
    transform: translateX(100%) scale(0.98) rotateY(0deg); 
    opacity: 0; 
    transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
    display: flex; 
    justify-content: center;
    transform-style: preserve-3d;
    will-change: transform, opacity, left;
  }
  .fn_cs_slider_wrapper li.hidden_card { 
    display: none; 
  }
  /* Reduce side gap offsets for a tighter layout */
  .fn_cs_slider_wrapper li.prev { 
    left: -48px; 
    z-index: 5;
    transform: translateX(0) scale(0.96) rotateY(-18deg);
    opacity: 1;
  }
  .fn_cs_slider_wrapper li.active { 
    left: 33%; 
    z-index: 10;
    transform: translateX(0) scale(1) rotateY(0deg);
    opacity: 1;
  }
  .fn_cs_slider_wrapper li.next { 
    left: calc(66% + 48px); 
    z-index: 5;
    transform: translateX(0) scale(0.96) rotateY(18deg);
    opacity: 1;
  }
  .fn_cs_slider_wrapper .item { 
    perspective: 2200px;
    transform-style: preserve-3d;
  }
  .fn_cs_slider_wrapper .item_in { 
    transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.3s ease;
    transform-style: preserve-3d;
    width: 24rem; /* wider card width to avoid compression */
    height: 32rem; /* consistent visual height */
  }
  .fn_cs_slider_wrapper .active .item_in { 
    transform: scale(1.06) translateZ(0);
    box-shadow: 0 0 40px rgba(0,217,255,0.25), inset 0 0 12px rgba(0,217,255,0.12);
  }
  .fn_cs_slider_wrapper .prev .item_in { 
    transform: scale(0.98) rotateY(-18deg);
    filter: brightness(0.9);
  }
  .fn_cs_slider_wrapper .next .item_in { 
    transform: scale(0.98) rotateY(18deg);
    filter: brightness(0.9);
  }
`;

    const [activeIndex, setActiveIndex] = useState(0);
    const [popupOpen, setPopupOpen] = useState(false);
    const [comingSoonPopupOpen, setComingSoonPopupOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedComingSoonGame, setSelectedComingSoonGame] = useState(null);
    const buttonclickRef = useRef(null);

    const playButtonClick = () => {
        if (buttonclickRef.current) {
            buttonclickRef.current.currentTime = 0;
            buttonclickRef.current.play();
        }
    };

    const handleLaunchGame = (game) => {
        playButtonClick();
        
        if (game.isComingSoon) {
            setSelectedComingSoonGame(game);
            setComingSoonPopupOpen(true);
        } else {
            setSelectedGame(game);
            setPopupOpen(true);
        }
    };

    const handleExitVR = () => {
        playButtonClick();
        window.history.back();
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
    };
    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % games.length);
    };

    const getCardClassName = (index) => {
        const offset = index - activeIndex;
        let displayOffset = offset;
        if (offset > games.length / 2) displayOffset = offset - games.length;
        if (offset < -games.length / 2) displayOffset = offset + games.length;

        if (displayOffset === 0) return 'active';
        if (displayOffset === -1) return 'prev';
        if (displayOffset === 1) return 'next';
        return 'hidden_card';
    };

    const handleGameLaunch = () => {
        if (!selectedGame) return;
        
        playButtonClick();
        setPopupOpen(false);

        if (selectedGame.isExternal) {
            window.location.href = selectedGame.route;
        } else if (!selectedGame.isComingSoon) {
            window.location.pathname = selectedGame.route;
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden relative flex flex-col bg-[#080E14] text-white">
            <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
            <style>{carouselStyles}</style>
            <FixedThreeBackground />

            <div className="relative z-10 flex flex-col h-full">
                <header className="flex justify-between items-center px-8 py-4">
                    <img src="assets/logo.png" alt="DATASENSE" className="h-6 sm:h-7 md:h-9" />
                    <CyberButton
                        variant="outline"
                        size="sm"
                        onClick={handleExitVR}
                        className="flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        <span>HOME</span>
                    </CyberButton>
                </header>

                <div className="text-center my-2 md:my-2">
                    <div className="relative w-fit mx-auto">
                        <div className="absolute inset-0 blur-xl rounded-lg pointer-events-none"></div>
                        <h1 className="text-3xl md:text-5xl font-black-ops-one font-bold text-primary mb-2.5">
                            DATASENSE GAMING ARENA
                        </h1>
                        <RotatingSubheading />
                        <div className="w-28 h-px mx-auto mt-6" />
                    </div>
                    {/* <h2 className="text-2xl md:text-3xl font-bold uppercase mt-8" 
                        style={{ textShadow: '0 0 15px rgba(0,217,255,0.5)' }}>
                        Select Your Mission
                    </h2> */}
                </div>
                
                <div className="flex-1 flex items-center justify-center relative fn_cs_slider_wrapper">
                    <div className="relative w-full max-w-6xl h-[34rem]">
                        <ul>
                            {games.map((game, index) => {
                                const cardClass = getCardClassName(index);
                                const isSideCard = cardClass === 'prev' || cardClass === 'next';

                                return (
                                    <li key={game.id} className={cardClass}>
                                        <div
                                            className={`item ${isSideCard ? 'cursor-pointer' : ''}`}
                                            onClick={() => {
                                                if (isSideCard) {
                                                    setActiveIndex(index);
                                                }
                                            }}
                                        >
                                            <div className="item_in w-[28rem] h-[32rem] p-6 bg-black/30 border border-gray-700 rounded-2xl">
                                                <div
                                                    className={`w-full h-full rounded-xl overflow-hidden border-2 relative transition-all duration-500 ${index === activeIndex ? 'group' : 'pointer-events-none'}`}
                                                    style={{
                                                        borderColor: game.color,
                                                        boxShadow: index === activeIndex ? `0 0 40px ${game.color}, inset 0 0 15px ${game.color}50` : 'none',
                                                    }}
                                                >
                                                    <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                                                    
                                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                                        <div className="transform transition-transform duration-500 ease-in-out group-hover:-translate-y-16">
                                                            <h3 className="text-2xl font-bold" style={{ color: game.color, textShadow: `0 0 10px ${game.color}` }}>{game.title}</h3>
                                                            <p className="text-md text-gray-300 mt-1">{game.description}</p>
                                                        </div>
                                                        
                                                        {index === activeIndex && (
                                                            <div className="absolute bottom-5 left-5 right-5 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
                                                                <CyberButton
                                                                    variant="primary"
                                                                    size="lg"
                                                                    className="w-full"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleLaunchGame(game);
                                                                    }}
                                                                >
                                                                    LAUNCH GAME
                                                                </CyberButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <button onClick={handlePrev} className="absolute left-4 md:left-24 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all z-20">
                        <ArrowLeft size={24} />
                    </button>
                    <button onClick={handleNext} className="absolute right-4 md:right-24 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all z-20">
                        <ArrowRight size={24} />
                    </button>
                </div>
                
                <div className="text-center py-4 flex-shrink-0">
                    <div className="inline-flex items-center gap-2">
                        {games.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-cyan-400 scale-125' : 'bg-gray-600'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <FuturisticGlitchPopup
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                badgeType={selectedGame?.title || ''}
                description={`Ready to launch ${selectedGame?.title}? You will be redirected to the game arena.`}
                yesLink={selectedGame?.route}
                onYesClick={handleGameLaunch}
            />

            <ComingSoonGlitchPopup
                open={comingSoonPopupOpen}
                onClose={() => setComingSoonPopupOpen(false)}
                badgeType={selectedComingSoonGame?.title || ''}
                description={`${selectedComingSoonGame?.title} is currently under development. We're working hard to bring you this exciting game soon!`}
            />
        </div>
    );
}