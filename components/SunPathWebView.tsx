import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {WebView} from 'react-native-webview';

type SunPathWebViewProps = {
    sunrise: string;
    sunset: string;
    width?: number;
    height?: number;
};

export default function SunPathWebView({
                                           sunrise,
                                           sunset,
                                           width = 300,
                                           height = 80,
                                       }: SunPathWebViewProps) {
    const [html, setHtml] = useState('');

    useEffect(() => {
        const rx = (width - 100) / 2;
        const ry = 50;
        const cx = width / 2;
        const cy = height - 20;
        const controlY = 20;
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; background: transparent; }
          svg { display: block; margin: 0 auto; }
        </style>
      </head>
      <body>
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <path d="M${cx - rx},${cy} Q${cx},${controlY} ${cx + rx},${cy}" stroke="#FDB813" stroke-width="3" fill="none" stroke-dasharray="4 4" />
          <circle id="sun" r="8" fill="#FDB813" cx="${cx - rx}" cy="${cy}" />
        </svg>
        <script>
          const rx = ${rx}, cx = ${cx}, cy = ${cy}, controlY = ${controlY};
          const parseTime = str => {
            const [h, m] = str.split(':').map(Number);
            return h * 60 + m;
          };
          const sunriseM = parseTime("${sunrise}");
          const sunsetM = parseTime("${sunset}");
          const total = sunsetM - sunriseM;

          function calcBezierPoint(t) {
            const x = (1 - t)**2 * (cx - rx) + 2 * (1 - t) * t * cx + t**2 * (cx + rx);
            const y = (1 - t)**2 * cy + 2 * (1 - t) * t * controlY + t**2 * cy;
            return { x, y };
          }

          let currentT = 0;

          function getTargetT() {
            const now = new Date();
            const mins = now.getHours() * 60 + now.getMinutes();
            const offset = mins - sunriseM;
            const percent = Math.max(0, Math.min(1, offset / total));
            return percent;
          }

          function animateTo(targetT, duration = 3000) {
            const sun = document.getElementById("sun");
            if (!sun) return;

            const startT = currentT;
            const startTime = performance.now();

            function frame(now) {
              const elapsed = now - startTime;
              const progress = Math.min(1, elapsed / duration);
              const easedProgress = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

              const t = startT + (targetT - startT) * easedProgress;
              const { x, y } = calcBezierPoint(t);
              sun.setAttribute("cx", x);
              sun.setAttribute("cy", y);

              if (progress < 1) {
                requestAnimationFrame(frame);
              } else {
                currentT = targetT;
              }
            }

            requestAnimationFrame(frame);
          }

          function update() {
            const t = getTargetT();
            animateTo(t);
          }

          // 初始化
          update();
          setInterval(update, 60000);
        </script>
      </body>
      </html>
    `;

        setHtml(htmlContent);
    }, [sunrise, sunset, width, height]);

    return (
        <View style={styles.container}>
            {html && (
                <WebView
                    originWhitelist={['*']}
                    source={{html}}
                    style={{width, height, backgroundColor: 'transparent'}}
                    scrollEnabled={false}
                />

            )}
            <View style={styles.labels}>
                <View style={styles.labelItem}>
                    <Text style={styles.labelTitle}>日出</Text>
                    <Text style={styles.labelTime}>{sunrise}</Text>
                </View>
                <View style={styles.labelItem}>
                    <Text style={styles.labelTitle}>日落</Text>
                    <Text style={styles.labelTime}>{sunset}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
    },
    labels: {
        width: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    labelItem: {
        alignItems: 'center',
    },
    labelTitle: {
        fontSize: 12,
        color: '#666',
    },
    labelTime: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
