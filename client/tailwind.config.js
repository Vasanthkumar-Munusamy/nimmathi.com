export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fdf4f0',
                    100: '#fbe4d8',
                    200: '#f6c5a8',
                    300: '#ef9e71',
                    400: '#e77040',
                    500: '#d95020',
                    600: '#b83f18',
                    700: '#922f14',
                    800: '#762615',
                    900: '#602215',
                },
                cream: '#fdf8f3',
                dark: '#1a1209',
            },
            fontFamily: {
                sans: ['Lato', 'Noto Sans Tamil', 'sans-serif'],
                tamil: ['Noto Sans Tamil', 'sans-serif'],
                display: ['Playfair Display', 'Noto Serif Tamil', 'serif'],
            },
        },
    },
    plugins: [],
};