Websys-Lab7

I used Chartjs for the visualization. Since I was handling timestamps as well, I needed to use momentjs as it was called by Chartjs as a depency. Odd enough, I had to manually grab momentjs from a CDN since the bundled version from Chartjs didn't let me use momoment() in javascript code.
There a three graphs: a doughnut/pie chart, a line chart, and a bar chart. The first shows the different symbols that have quotes in the database, as well as the number of quotes under a symbol.
The second graph gets informations from quotes regarding a single symbol, which is randomly chosen at page load. The colors are mainly randomized. The dots along the lines are either the price of the stock symbol at the time the quote was taken, the highest price during that day, and the lowest price during that day.
The last graph just shows the number of API calls over time. The colors of the bars changes as the page is refreshed. I didn't randomize the colors but it seems to occur anyways.

Doing the bar chart took the longest, since chartjs didn't interact with the timestamps that well, along with momentjs having issues integrating. Line chart was done after the bar, so it managed to avoid most of the hassles.