/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    // "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./app/**/*.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      container: {
			// center: true,
			// padding: '2rem',
			screens: {
				// '2xl': '1400px'
			}
		},
      fontFamily: {
				'cyber': ['Orbitron', 'sans-serif'],
				'mono': ['JetBrains Mono', 'monospace'],
				'game':['Black Ops One', 'sans-serif'],
			},
      colors: {
        'custom-blue': '#1ea3a7',
        'home-button': '#000e14',
        'oxford-blue': '#002147',
        'custom-cyan': '#10e4ff',
        border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				cyber: {
					grid: 'hsl(var(--cyber-grid))',
					accent: 'hsl(var(--cyber-accent))',
					warning: 'hsl(var(--cyber-warning))',
					success: 'hsl(var(--cyber-success))',
					glow: 'hsl(var(--cyber-glow))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
      },
      borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
      keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'pulse-glow': {
					'0%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
					},
					'100%': { 
						boxShadow: '0 0 40px hsl(var(--primary) / 0.8), 0 0 60px hsl(var(--primary) / 0.4)'
					}
				},
				'scan': {
					'0%': { left: '-100%' },
					'100%': { left: '100%' }
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' },
					'100%': { transform: 'translate(0)' }
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh)', opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				}
			},
      animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
				'scan': 'scan 3s linear infinite',
				'glitch': 'glitch 2s infinite',
				'matrix-rain': 'matrix-rain 3s linear infinite'
			}
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'),
  ],
}

