'use client';

export default function ViewSwitcher({ currentView, onViewChange }) {
  const views = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'table', label: 'Table', icon: '☰' }
  ];

  return (
    <div style={styles.container}>
      {views.map(view => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          style={{
            ...styles.button,
            ...(currentView === view.id ? styles.activeButton : {})
          }}
        >
          <span style={styles.icon}>{view.icon}</span>
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    padding: '4px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s',
    outline: 'none'
  },
  activeButton: {
    backgroundColor: '#fff',
    color: '#1976d2',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  icon: {
    fontSize: '16px'
  }
};
