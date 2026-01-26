'use client';

import { getPlatformColor } from '@/lib/platformColors';

export default function PlatformFilter({ platforms, activePlatforms, onToggle, darkMode = false }) {
  return (
    <div style={styles.container}>
      <span style={{
        ...styles.label,
        ...(darkMode ? { color: '#e5e7eb' } : {})
      }}>Platforms:</span>
      <div style={styles.filterGroup}>
        {platforms.map(platform => {
          const isActive = activePlatforms.includes(platform.id);
          const colors = getPlatformColor(platform.id);
          
          return (
            <button
              key={platform.id}
              onClick={() => onToggle(platform.id)}
              style={{
                ...styles.filterButton,
                ...(isActive ? {
                  backgroundColor: colors.accent,
                  color: 'white',
                  borderColor: colors.accent,
                } : {
                  backgroundColor: 'white',
                  color: '#6b7280',
                  borderColor: '#e5e7eb',
                  opacity: 0.6
                })
              }}
              title={`${isActive ? 'Hide' : 'Show'} ${platform.name} contests`}
            >
              <span style={{
                ...styles.dot,
                backgroundColor: isActive ? 'white' : colors.accent
              }} />
              {platform.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    whiteSpace: 'nowrap'
  },
  filterGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    border: '2px solid',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    userSelect: 'none'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0
  }
};
