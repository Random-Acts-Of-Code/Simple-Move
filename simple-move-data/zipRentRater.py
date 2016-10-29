import numpy as np
import csv, sys

# Takes CSV file data on rental prices and gives the zip code a rank based on several critera

def main():

    fileNameIn = ["studio_zip.csv", "one_zip.csv", "two_zip.csv", "three_zip.csv", "four_zip.csv", "five_zip.csv"]
    fileNameOut = ["studio.csv", "one.csv", "two.csv", "three.csv", "four.csv", "five.csv"]
    maxCityPrice = [2199, 2390, 2694.5, 3000, 3700, 4496.5]

    # loop through all the apartment sizes
    for j in range(len(fileNameIn)):
        filename = "in/" + fileNameIn[j]
        with open(filename, "rb") as f:
            reader = csv.reader(f)
            try:
                rent = {}
                xd = []
                yd = []
                maxRentRatio = 0
                minRentRatio = 100
                maxSlope = -100
                minSlope = 100
                maxRSqr = 0
                minRSqr = 100

                # Parse csv file
                for row in reader:

                    # Only New York data
                    if (row[1] == "New York"):
                        # Only rent dollar values
                        length = len(row) - 6
                        for i in range(length):
                            if (row[i+6] != ""):
                                xd.append(i + 1)
                                yd.append(float(row[i+6]))

                    # Analyze data
                    if (xd != [] and yd != []):
                        reorder = sorted(range(len(xd)), key = lambda ii: xd[ii])
                        xd = [xd[ii] for ii in reorder]
                        yd = [yd[ii] for ii in reorder]

                        # Get Slope and R2 values
                        data = getUpDownRSqr(xd, yd)
                        slope = data[0]

                        # Find min max slope
                        if (slope > maxSlope):
                            maxSlope = slope
                        if (slope < minSlope):
                            minSlope = slope

                        rSqr = data[1]

                        # Find min max rRqr
                        if (rSqr > maxRSqr):
                            maxRSqr = rSqr
                        if (rSqr < minRSqr):
                            minRSqr = rSqr

                        # Get current rent price
                        lastIndex = len(row) - 1
                        currRent = float(row[lastIndex])

                        # Add City Median price
                        cityRent = maxCityPrice[j]

                        # Determine rent ratio
                        rentRatio = currRent / cityRent
                        if (rentRatio > maxRentRatio):
                            maxRentRatio = rentRatio
                        if (rentRatio < minRentRatio):
                            minRentRatio = rentRatio

                        newData = [rentRatio, slope, rSqr]

                        # Map data to zip code
                        rent[int(row[0])] = newData

                        # Clear list for next row
                        xd = []
                        yd = []



                # Determine rental index for each zip
                for key, value in rent.items():

                    data = value
                    cityCompare = scaleTo100(data[0], maxRentRatio, minRentRatio)
                    priceTrend = scaleTo100(data[1], maxSlope, minSlope)
                    priceStability = scaleTo100(data[2], maxRSqr, minRSqr)

                    values = [cityCompare, priceTrend, priceStability]
                    rent[key] = getRentalIndex(values)

                # write to new csv
                outName = "out/" + fileNameOut[j]
                with open(outName, "wb") as csv_file:
                    writer = csv.writer(csv_file)
                    for key, value in rent.items():
                        writer.writerow([key, value])

            except csv.Error as e:
                sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))


def getUpDownRSqr(xd, yd):
    par = np.polyfit(xd, yd, 1, full=True)
    slope = par[0][0]
    intercept=par[0][1]

    variance = np.var(yd)
    residuals = np.var([(slope*xx + intercept - yy)  for xx,yy in zip(xd,yd)])
    rSqr = np.round(1-residuals/variance, decimals=2)

    data = [slope, rSqr]
    return data

def getRentalIndex(data):

    # Split data info
    cityCompare = data[0]
    priceTrend = data[1]
    priceStability = data[2]

    rentalIndex = .5 * cityCompare + .25 * priceTrend + .25 * priceStability
    return rentalIndex

def scaleTo100(oldValue, oldMax, oldMin):

    oldRange = (oldMax - oldMin)
    newValue = (((oldValue - oldMin) * 100) / oldRange)

    return newValue

if __name__ == "__main__":
    main()
