'use client';

import { getPlatformColor, PRIMARY_PLATFORMS } from '@/lib/platformColors';

export default function ColorLegend({ darkMode = false }) {
  return (
    <div style={styles.container}>
      <span style={{
        ...styles.label,
        ...(darkMode ? { color: '#e5e7eb' } : {})
      }}>Legend:</span>
      <div style={styles.legendGroup}>
        {PRIMARY_PLATFORMS.map(platform => {
          const colors = getPlatformColor(platform.id, darkMode);
          
          return (
            <div key={platform.id} style={styles.legendItem}>
              <span 
                style={{
                  ...styles.colorDot,
                  backgroundColor: colors.accent
                }} 
              />
              <span style={{
                ...styles.platformName,
                ...(darkMode ? { color: '#b4bac8' } : {})
              }}>{platform.name}</span>
            </div>
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
  legendGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  colorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0
  },
  platformName: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  }
};
