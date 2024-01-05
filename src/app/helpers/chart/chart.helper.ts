import { Injectable } from '@angular/core';

import { CommonHelperService } from '../../helpers/common/common.helper';
import { ChartConfig } from '../../shared/common/chart.config';
import { Chart } from 'chart.js';

/**
 * Chart helper service class
 */
@Injectable()
export class ChartHelperService {

    /**
     * Chart helper class dependencies
     * @param CommonHelperService commonHelperService
     * @param ChartConfig chartConfig
     */
    constructor(
        private commonHelperService: CommonHelperService,
        private chartConfig: ChartConfig
    ) {}

    /**
     * To draw common donught chart for account/overview page
     * @param label
     * @param data
     * @param chart_rendered
     * @param defaultCenterLabel
     * @param currency_symbol
     * @param total
     * @param legend_rendered
     */
    public commonDoughnutChart(label, data, chart_rendered, defaultCenterLabel, currency_symbol, total, legend_rendered) {

        if (chart_rendered == null) {
            return;
        }

        if (label.length > 0 && data.length > 0) {
            defaultCenterLabel = defaultCenterLabel;
        } else {
            defaultCenterLabel = 'You have not added accounts.'
        }

        const config = {
            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    data: data,
                    backgroundColor: this.chartConfig.poolColors(total),
                    // hoverBackgroundColor: label
                }]
            },
            options: {
                cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    arc: {
                        roundedCornersFor: 0,
                        borderWidth: 0.5
                    },
                    center: {
                        // the longest text that could appear in the center
                        maxText: '100%',
                        text: defaultCenterLabel,
                        fontColor: '#777',
                        fontFamily: this.chartConfig.chartConfiguration.fontFamily,
                        fontStyle: 'normal',
                        // fontSize: 12,
                        // tslint:disable-next-line:max-line-length
                        // if a fontSize is NOT specified, we will scale (within the below limits) maxText to take up the maximum space in the center
                        // if these are not specified either, we default to 1 and 256
                        minFontSize: 1,
                        maxFontSize: 13,
                    }
                },
                legend: {
                    display: false,
                    /*position: 'bottom',
                    labels: {
                        boxWidth: 20
                    }*/
                },
                tooltips: {
                    callbacks: {
                        label: (tooltipItems, data1) => {
                            const label1 = data1.labels;
                            const sum = data1.datasets[0].data.reduce(add, 0);
                            function add(a, b) {
                                return a + b;
                            }
                            /* let tooltipValue;
                            tooltipValue = (data1.datasets[0].data[tooltipItems.index] / sum * 100);
                            tooltipValue = this.commonHelperService.numberWithCommas(tooltipValue); */
                            return label1[tooltipItems.index] + ', ' + this.getTooltipValue(data1, tooltipItems, sum) + ' %';
                        },
                        /*beforeLabel: function(tooltipItems, data) {
                                return data.datasets[0].data[tooltipItems.index] + ' hrs';
                        }*/
                    }
                }
            }
        };


        const ctx = (<HTMLCanvasElement>document.getElementById(chart_rendered)).getContext('2d');
        const myChart = new Chart(ctx, config);
        // to generate legends
        document.getElementById(legend_rendered).innerHTML = myChart.generateLegend();
    }

    /**
     * To draw status chart on budget and account/overview page
     * @param label
     * @param data
     * @param color
     * @param chart_rendered
     * @param defaultCenterLabel
     */
    public commonStatusChart(label, data, color, chart_rendered, defaultCenterLabel) {
        // chart start
        if (chart_rendered == null) {
            return;
        }

        const config = {
            type: 'doughnut',
            data: {
                labels: label,
                datasets: [{
                    data: data,
                    backgroundColor: color,
                }]
            },
            options: {
                cutoutPercentage: this.chartConfig.chartConfiguration.cutoutPercentage, // to set size of dognut chart
                responsive: true,
                // maintainAspectRatio: false,
                tooltips : {
                    enabled: false
                },
                legend: false,
                elements: {
                    arc: {
                        roundedCornersFor: 0,
                        borderWidth: 0.5
                    },
                    center: {
                        // the longest text that could appear in the center
                        maxText: '100%',
                        text: defaultCenterLabel,
                        fontColor: '#777',
                        fontFamily: this.chartConfig.chartConfiguration.fontFamily,
                        fontStyle: 'normal',
                        // fontSize: 12,
                        // if a fontSize is NOT specified, we will scale (within the below limits)
                        // maxText to take up the maximum space in the center
                        // if these are not specified either, we default to 1 and 256
                        minFontSize: 1,
                        maxFontSize: 13,
                    }
                }
            }
        };

        const ctx = (<HTMLCanvasElement>document.getElementById(chart_rendered)).getContext('2d');
        const myChart = new Chart(ctx, config);
    }

    /**
     * To get tooltip value
     * @param data1
     * @param tooltipItems
     */
    public getTooltipValue(data1, tooltipItems, sum) {
        let tooltipValue;
        tooltipValue = (data1.datasets[0].data[tooltipItems.index] / sum * 100);
        tooltipValue = this.commonHelperService.numberWithCommas(tooltipValue);

        return tooltipValue;
    }
}
