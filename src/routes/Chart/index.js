/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {Card, Row, Col} from 'antd';
import ReactEcharts from 'echarts-for-react';
function keep(number) {
  return Math.round(100 * number) / 100
}
class Index extends PureComponent {
  getRecentNetValueOption = () => {
    const list = [{'number': '0.0', 'rateCount': 17, 'rateCountList': [0.06, 0.01, 0.06, 0.03, 0.01, 0.05, 0, 0.07, 0.06, 0.06, 0.01, 0.07, 0.04, 0.03, 0.07, 0.08, 0.02], 'waveCount': 0, 'waveCountList': []}, {'number': '0.1', 'rateCount': 20, 'rateCountList': [0.14, 0.12, 0.15, 0.15, 0.12, 0.18, 0.12, 0.15, 0.12, 0.18, 0.13, 0.17, 0.16, 0.16, 0.15, 0.17, 0.19, 0.11, 0.19, 0.17], 'waveCount': 0, 'waveCountList': []}, {'number': '0.2', 'rateCount': 17, 'rateCountList': [0.22, 0.25, 0.29, 0.24, 0.29, 0.22, 0.26, 0.24, 0.27, 0.26, 0.28, 0.25, 0.26, 0.25, 0.26, 0.29, 0.23], 'waveCount': 0, 'waveCountList': []}, {'number': '0.3', 'rateCount': 10, 'rateCountList': [0.35, 0.35, 0.31, 0.31, 0.38, 0.31, 0.38, 0.38, 0.31, 0.34], 'waveCount': 0, 'waveCountList': []}, {'number': '0.4', 'rateCount': 13, 'rateCountList': [0.41, 0.41, 0.44, 0.45, 0.46, 0.4, 0.47, 0.46, 0.4, 0.48, 0.45, 0.49, 0.46], 'waveCount': 0, 'waveCountList': []}, {'number': '0.5', 'rateCount': 13, 'rateCountList': [0.52, 0.56, 0.53, 0.58, 0.52, 0.59, 0.54, 0.52, 0.58, 0.5, 0.55, 0.51, 0.57], 'waveCount': 1, 'waveCountList': [0.59]}, {'number': '0.6', 'rateCount': 15, 'rateCountList': [0.61, 0.64, 0.67, 0.63, 0.61, 0.61, 0.65, 0.66, 0.67, 0.62, 0.68, 0.65, 0.62, 0.66, 0.61], 'waveCount': 2, 'waveCountList': [0.62, 0.6]}, {'number': '0.7', 'rateCount': 9, 'rateCountList': [0.77, 0.77, 0.76, 0.77, 0.74, 0.71, 0.74, 0.75, 0.76], 'waveCount': 8, 'waveCountList': [0.79, 0.71, 0.72, 0.77, 0.75, 0.79, 0.72, 0.78]}, {'number': '0.8', 'rateCount': 11, 'rateCountList': [0.86, 0.8, 0.8, 0.83, 0.83, 0.83, 0.87, 0.83, 0.85, 0.82, 0.88], 'waveCount': 4, 'waveCountList': [0.85, 0.83, 0.81, 0.87]}, {'number': '0.9', 'rateCount': 8, 'rateCountList': [0.9, 0.98, 0.99, 0.92, 0.92, 0.98, 0.95, 0.9], 'waveCount': 9, 'waveCountList': [0.98, 0.97, 0.99, 0.91, 0.9, 0.93, 0.98, 0.9, 0.93]}, {'number': '1.0', 'rateCount': 9, 'rateCountList': [1.02, 1.05, 1, 1.02, 1.03, 1.01, 1.08, 1.06, 1.07], 'waveCount': 12, 'waveCountList': [1.07, 1.05, 1.09, 1.05, 1.01, 1.06, 1.06, 1.03, 1.09, 1.01, 1.02, 1.08]}, {'number': '1.1', 'rateCount': 10, 'rateCountList': [1.14, 1.18, 1.15, 1.14, 1.12, 1.15, 1.13, 1.17, 1.14, 1.12], 'waveCount': 15, 'waveCountList': [1.11, 1.11, 1.16, 1.17, 1.11, 1.11, 1.15, 1.1, 1.15, 1.12, 1.16, 1.18, 1.16, 1.12, 1.19]}, {'number': '1.2', 'rateCount': 11, 'rateCountList': [1.29, 1.2, 1.2, 1.29, 1.27, 1.23, 1.24, 1.25, 1.23, 1.22, 1.25], 'waveCount': 13, 'waveCountList': [1.27, 1.26, 1.27, 1.27, 1.25, 1.27, 1.26, 1.27, 1.22, 1.25, 1.24, 1.23, 1.25]}, {'number': '1.3', 'rateCount': 6, 'rateCountList': [1.31, 1.34, 1.32, 1.34, 1.38, 1.33], 'waveCount': 19, 'waveCountList': [1.37, 1.38, 1.31, 1.32, 1.35, 1.39, 1.33, 1.37, 1.35, 1.31, 1.32, 1.3, 1.3, 1.33, 1.31, 1.39, 1.33, 1.39, 1.34]}, {'number': '1.4', 'rateCount': 4, 'rateCountList': [1.43, 1.49, 1.42, 1.45], 'waveCount': 11, 'waveCountList': [1.45, 1.4, 1.43, 1.4, 1.44, 1.47, 1.42, 1.45, 1.49, 1.47, 1.48]}, {'number': '1.5', 'rateCount': 5, 'rateCountList': [1.5, 1.52, 1.54, 1.51, 1.54], 'waveCount': 12, 'waveCountList': [1.53, 1.52, 1.56, 1.55, 1.56, 1.57, 1.5, 1.57, 1.58, 1.58, 1.53, 1.59]}, {'number': '1.6', 'rateCount': 7, 'rateCountList': [1.68, 1.66, 1.64, 1.63, 1.62, 1.69, 1.61], 'waveCount': 7, 'waveCountList': [1.67, 1.64, 1.65, 1.64, 1.65, 1.62, 1.6]}, {'number': '1.7', 'rateCount': 7, 'rateCountList': [1.72, 1.75, 1.73, 1.79, 1.76, 1.75, 1.74], 'waveCount': 19, 'waveCountList': [1.73, 1.72, 1.75, 1.78, 1.74, 1.7, 1.72, 1.74, 1.74, 1.71, 1.76, 1.71, 1.77, 1.76, 1.77, 1.7, 1.79, 1.75, 1.7]}, {'number': '1.8', 'rateCount': 6, 'rateCountList': [1.8, 1.84, 1.83, 1.84, 1.84, 1.81], 'waveCount': 7, 'waveCountList': [1.88, 1.8, 1.84, 1.86, 1.82, 1.88, 1.8]}, {'number': '1.9', 'rateCount': 2, 'rateCountList': [1.97, 1.95], 'waveCount': 6, 'waveCountList': [1.94, 1.97, 1.94, 1.97, 1.99, 1.94]}, {'number': '2.0', 'rateCount': 3, 'rateCountList': [2.08, 2.03, 2.09], 'waveCount': 9, 'waveCountList': [2.01, 2.02, 2.05, 2.08, 2.08, 2, 2.08, 2, 2.03]}, {'number': '2.1', 'rateCount': 5, 'rateCountList': [2.14, 2.11, 2.16, 2.12, 2.14], 'waveCount': 18, 'waveCountList': [2.14, 2.13, 2.1, 2.15, 2.19, 2.14, 2.17, 2.17, 2.1, 2.15, 2.12, 2.17, 2.14, 2.11, 2.18, 2.1, 2.17, 2.12]}, {'number': '2.2', 'rateCount': 4, 'rateCountList': [2.2, 2.23, 2.27, 2.22], 'waveCount': 11, 'waveCountList': [2.24, 2.25, 2.21, 2.2, 2.26, 2.23, 2.26, 2.27, 2.22, 2.22, 2.22]}, {'number': '2.3', 'rateCount': 4, 'rateCountList': [2.33, 2.38, 2.39, 2.37], 'waveCount': 4, 'waveCountList': [2.32, 2.31, 2.31, 2.33]}, {'number': '2.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 4, 'waveCountList': [2.48, 2.44, 2.49, 2.43]}, {'number': '2.5', 'rateCount': 5, 'rateCountList': [2.5, 2.54, 2.53, 2.59, 2.54], 'waveCount': 4, 'waveCountList': [2.56, 2.53, 2.51, 2.51]}, {'number': '2.6', 'rateCount': 3, 'rateCountList': [2.63, 2.65, 2.66], 'waveCount': 3, 'waveCountList': [2.64, 2.6, 2.69]}, {'number': '2.7', 'rateCount': 5, 'rateCountList': [2.79, 2.73, 2.78, 2.73, 2.71], 'waveCount': 3, 'waveCountList': [2.75, 2.72, 2.71]}, {'number': '2.8', 'rateCount': 2, 'rateCountList': [2.82, 2.85], 'waveCount': 3, 'waveCountList': [2.85, 2.84, 2.89]}, {'number': '2.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 7, 'waveCountList': [2.97, 2.9, 2.94, 2.96, 2.92, 2.9, 2.97]}, {'number': '3.0', 'rateCount': 1, 'rateCountList': [3.03], 'waveCount': 4, 'waveCountList': [3.01, 3.07, 3.07, 3.08]}, {'number': '3.1', 'rateCount': 1, 'rateCountList': [3.16], 'waveCount': 4, 'waveCountList': [3.11, 3.11, 3.15, 3.13]}, {'number': '3.2', 'rateCount': 3, 'rateCountList': [3.25, 3.23, 3.21], 'waveCount': 2, 'waveCountList': [3.23, 3.2]}, {'number': '3.3', 'rateCount': 1, 'rateCountList': [3.31], 'waveCount': 4, 'waveCountList': [3.32, 3.36, 3.34, 3.32]}, {'number': '3.4', 'rateCount': 1, 'rateCountList': [3.41], 'waveCount': 4, 'waveCountList': [3.42, 3.46, 3.49, 3.42]}, {'number': '3.5', 'rateCount': 1, 'rateCountList': [3.51], 'waveCount': 3, 'waveCountList': [3.57, 3.54, 3.58]}, {'number': '3.6', 'rateCount': 1, 'rateCountList': [3.6], 'waveCount': 0, 'waveCountList': []}, {'number': '3.7', 'rateCount': 2, 'rateCountList': [3.73, 3.79], 'waveCount': 4, 'waveCountList': [3.71, 3.76, 3.74, 3.74]}, {'number': '3.8', 'rateCount': 1, 'rateCountList': [3.88], 'waveCount': 3, 'waveCountList': [3.84, 3.83, 3.88]}, {'number': '3.9', 'rateCount': 2, 'rateCountList': [3.9, 3.9], 'waveCount': 2, 'waveCountList': [3.93, 3.95]}, {'number': '4.0', 'rateCount': 1, 'rateCountList': [4.02], 'waveCount': 0, 'waveCountList': []}, {'number': '4.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.17]}, {'number': '4.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.23]}, {'number': '4.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.33]}, {'number': '4.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.47]}, {'number': '4.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.58]}, {'number': '4.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [4.62]}, {'number': '4.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '4.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '4.9', 'rateCount': 1, 'rateCountList': [4.97], 'waveCount': 0, 'waveCountList': []}, {'number': '5.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [5.04]}, {'number': '5.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [5.14]}, {'number': '5.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '5.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 1, 'waveCountList': [5.35]}, {'number': '5.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '5.5', 'rateCount': 1, 'rateCountList': [5.59], 'waveCount': 0, 'waveCountList': []}, {'number': '5.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '5.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '5.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '5.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '6.9', 'rateCount': 1, 'rateCountList': [6.96], 'waveCount': 0, 'waveCountList': []}, {'number': '7.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.5', 'rateCount': 1, 'rateCountList': [7.51], 'waveCount': 0, 'waveCountList': []}, {'number': '7.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '7.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '8.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '9.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '10.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '11.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '12.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '13.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '14.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '15.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '16.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '17.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '18.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.0', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.1', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.2', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.3', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.4', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.5', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.6', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.7', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.8', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}, {'number': '19.9', 'rateCount': 0, 'rateCountList': [], 'waveCount': 0, 'waveCountList': []}]
    // list.reverse()
    let xData = [];
    let yData = [];
    let zData = [];
    list.forEach(function (item) {
      xData.push(item['number']);
      yData.push(item['rateCount']);
      zData.push(item['waveCount']);
    });
    return {
      title: {
        text: '变化',
        left: 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: '500'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      calculable: true,
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        {
          name: '幅度',
          data: yData,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '幅度',
          data: zData,
          type: 'line',
          lineStyle: {
            color: '#ffa877'
          }
        }
      ]
    };
  };

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.getRecentNetValueOption()}
          notMerge={true}
          style={{height: '600px'}}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    );
  }
}

export default Index;
