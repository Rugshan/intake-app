import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Beef, Target, TrendingUp, Calendar, Plus, Minus, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, startOfWeek, addDays, isToday, subDays, addDays as addDaysFn } from 'date-fns';
import './App.css';

interface IntakeEntry {
  id: string;
  date: string;
  protein: number;
  water: number;
  timestamp: number;
}

interface DailyGoal {
  protein: number;
  water: number;
}

function App() {
  const [entries, setEntries] = useState<IntakeEntry[]>([]);
  const [goals, setGoals] = useState<DailyGoal>({ protein: 150, water: 2000 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [tempEntry, setTempEntry] = useState({ protein: 0, water: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const isInitialized = useRef(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    const savedEntries = localStorage.getItem('intakeEntries');
    const savedGoals = localStorage.getItem('intakeGoals');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
      } catch (error) {
        console.error('Error parsing entries:', error);
      }
    }
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error('Error parsing goals:', error);
      }
    }
    if (savedDarkMode) {
      try {
        const parsedDarkMode = JSON.parse(savedDarkMode);
        setDarkMode(parsedDarkMode);
      } catch (error) {
        console.error('Error parsing dark mode:', error);
      }
    }
    
    isInitialized.current = true;
  }, []);

  // Save data to localStorage whenever entries, goals, or darkMode change
  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    localStorage.setItem('intakeEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    localStorage.setItem('intakeGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const today = format(currentDate, 'yyyy-MM-dd');
  const todayEntries = entries.filter(entry => entry.date === today);
  
  const todayProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const todayWater = todayEntries.reduce((sum, entry) => sum + entry.water, 0);

  const proteinProgress = Math.min((todayProtein / goals.protein) * 100, 100);
  const waterProgress = Math.min((todayWater / goals.water) * 100, 100);

  const addEntry = () => {
    if (tempEntry.protein > 0 || tempEntry.water > 0) {
      const newEntry: IntakeEntry = {
        id: Date.now().toString(),
        date: today,
        protein: tempEntry.protein,
        water: tempEntry.water,
        timestamp: Date.now()
      };
      setEntries(prev => [...prev, newEntry]);
      setTempEntry({ protein: 0, water: 0 });
      setShowAddModal(false);
    }
  };

  const addQuickWater = (amount: number) => {
    const newEntry: IntakeEntry = {
      id: Date.now().toString(),
      date: today,
      protein: 0,
      water: amount,
      timestamp: Date.now()
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateGoal = (type: 'protein' | 'water', value: number) => {
    setGoals(prev => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(prev => subDays(prev, 1));
    } else {
      setCurrentDate(prev => addDaysFn(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate weekly data for charts
  const getWeeklyData = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekData = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayEntries = entries.filter(entry => entry.date === dateStr);
      
      weekData.push({
        date: format(date, 'EEE'),
        protein: dayEntries.reduce((sum, entry) => sum + entry.protein, 0),
        water: dayEntries.reduce((sum, entry) => sum + entry.water, 0),
        isToday: isToday(date)
      });
    }
    
    return weekData;
  };

  const weeklyData = getWeeklyData();

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header-top">
          <h1>Intake App</h1>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
            </button>
          </div>
        </div>
        <div className="date-navigation">
          <button 
            className="nav-button"
            onClick={() => navigateDate('prev')}
            aria-label="Previous day"
          >
            <ChevronLeft className="icon" />
          </button>
          <div className="date-selector" onClick={goToToday}>
            <Calendar className="icon" />
            <span>{format(currentDate, 'MMMM d, yyyy')}</span>
            {!isToday(currentDate) && <span className="today-indicator">(Click for today)</span>}
          </div>
          <button 
            className="nav-button"
            onClick={() => navigateDate('next')}
            aria-label="Next day"
          >
            <ChevronRight className="icon" />
          </button>
        </div>
      </header>

      <main className="main">
        {/* Today's Progress */}
        <section className="progress-section">
          <h2>Today's Progress</h2>
          <div className="progress-cards">
            <div className="progress-card protein">
              <div className="progress-header">
                <Beef className="icon" />
                <span>Protein</span>
              </div>
              <div className="progress-stats">
                <span className="current">{todayProtein}g</span>
                <span className="goal">/ {goals.protein}g</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${proteinProgress}%` }}></div>
              </div>
              <div className="progress-percentage">{proteinProgress.toFixed(0)}%</div>
            </div>

            <div className="progress-card water">
              <div className="progress-header">
                <Droplets className="icon" />
                <span>Water</span>
              </div>
              <div className="progress-stats">
                <span className="current">{todayWater}ml</span>
                <span className="goal">/ {goals.water}ml</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${waterProgress}%` }}></div>
              </div>
              <div className="progress-percentage">{waterProgress.toFixed(0)}%</div>
            </div>
          </div>
        </section>

        {/* Quick Water Buttons */}
        <section className="quick-water-section">
          <h2>Quick Water</h2>
          <div className="quick-water-buttons">
            <button 
              className="quick-water-btn small"
              onClick={() => addQuickWater(250)}
            >
              <Droplets className="icon" />
              <span>Cup</span>
              <span className="amount">250ml</span>
            </button>
            <button 
              className="quick-water-btn bottle"
              onClick={() => addQuickWater(500)}
            >
              <Droplets className="icon" />
              <span>Bottle</span>
              <span className="amount">500ml</span>
            </button>
          </div>
        </section>

        {/* Weekly Chart */}
        <section className="chart-section">
          <h2>Weekly Overview</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="protein" fill="#ef4444" name="Protein (g)" />
                <Bar dataKey="water" fill="#3b82f6" name="Water (ml)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Goals Settings */}
        <section className="goals-section">
          <h2>Daily Goals</h2>
          <div className="goals-form">
            <div className="goal-input">
              <label>
                <Beef className="icon" />
                Protein Goal (g)
              </label>
              <div className="input-group">
                <button onClick={() => updateGoal('protein', goals.protein - 10)}>
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={goals.protein}
                  onChange={(e) => updateGoal('protein', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <button onClick={() => updateGoal('protein', goals.protein + 10)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="goal-input">
              <label>
                <Droplets className="icon" />
                Water Goal (ml)
              </label>
              <div className="input-group">
                <button onClick={() => updateGoal('water', goals.water - 100)}>
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={goals.water}
                  onChange={(e) => updateGoal('water', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <button onClick={() => updateGoal('water', goals.water + 100)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Today's Entries */}
        <section className="entries-section">
          <div className="entries-header">
            <h2>Today's Entries</h2>
            <button className="add-button" onClick={() => setShowAddModal(true)}>
              <Plus size={20} />
              Add Entry
            </button>
          </div>
          <div className="entries-list">
            {todayEntries.length === 0 ? (
              <div className="empty-state">
                <p>No entries for today</p>
                <p>Click "Add Entry" to start tracking</p>
              </div>
            ) : (
              todayEntries.map(entry => (
                <div key={entry.id} className="entry-item">
                  <div className="entry-info">
                    <div className="entry-time">
                      {format(entry.timestamp, 'HH:mm')}
                    </div>
                    <div className="entry-values">
                      {entry.protein > 0 && (
                        <span className="protein-value">
                          <Beef size={16} />
                          {entry.protein}g
                        </span>
                      )}
                      {entry.water > 0 && (
                        <span className="water-value">
                          <Droplets size={16} />
                          {entry.water}ml
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Barbell Emoji at Bottom */}
      <div className="bottom-emoji">
        <span role="img" aria-label="barbell">🏋️‍♂️</span>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Intake Entry</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>
                  <Beef className="icon" />
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={tempEntry.protein}
                  onChange={(e) => setTempEntry(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>
                  <Droplets className="icon" />
                  Water (ml)
                </label>
                <input
                  type="number"
                  value={tempEntry.water}
                  onChange={(e) => setTempEntry(prev => ({ ...prev, water: parseInt(e.target.value) || 0 }))}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="save-button" onClick={addEntry}>
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
