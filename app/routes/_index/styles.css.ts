import { style } from '@vanilla-extract/css';

export const header = style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.25rem',
});

export const button = style({
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
});

export const icon = style({
    width: '2rem',
    height: '2rem',
});

export const section = style({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
});
