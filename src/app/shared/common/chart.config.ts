import { categoryColorList } from './category-color-list';

/**
 * Chart configuration
 */
export class ChartConfig {

    /** Config object for modal */
    public config = {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
    };

    /** Chart config */
    public chartConfiguration = {
        cutoutPercentage: 60,
        fontFamily: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif'
    };

    /** Color list */
    private chartColorList: string[] = [
        '#FFC6D9',
        '#B5D7E9',
        '#FFFACD',
        '#CDFFFA',
        '#FACDFF',
        '#FFF0F5',
        '#D2EBF6',
        '#DAF2C2',
        '#CDD2FF',
        '#DFFBFF',
        '#D9FFC6',
        '#C6D9FF'
    ]

    /** @ignore */
    constructor() { }

    /**
     * To calculate dynamic colors
     */
    public dynamicColors = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    /**
     * To generate dynamic color hexcode
     */
    public poolColors = (a) => {
        const pool: string[] = [];
        let colorCode;
        for (let i = 0; i < a; i++) {
            if (this.chartColorList[i]) {
                colorCode = this.chartColorList[i];
                colorCode = this.colorLuminance(colorCode, -0.05);
                pool.push(colorCode);
            } else {
                pool.push(this.dynamicColors());
            }
        }
        return pool;
    }

    /**
     * To get corresponding category color code
     * @param category
     */
    public getCategoryColorCode = (category) => {
        let colorCode: any;
        if (category in categoryColorList) {
            colorCode = categoryColorList[category];
        } else {
            colorCode = '';
        }
        return colorCode;
    }

    /** To calculate dark color for goal page */
    public colorLuminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = '#', c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ('00' + c).substr(c.length);
        }
        return rgb;
    }
}
