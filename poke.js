const puppeteer = require("puppeteer");

const MAX_ROWS = 3
const MAX_COLS = 3

async function run(screenWidth, screenHeight, row, col) {
    const width = (screenWidth / MAX_COLS)
    const height = (screenHeight / MAX_ROWS)
    const positionX = (row * width)
    const positionY = (col * height)    

    foundTimeslot = false

    while (!foundTimeslot) {
        try {
            const browser = await puppeteer.launch({
                headless: false,
                args: [
                    `--window-position=${positionX},${positionY}`, 
                    `--window-size=${width},${height}`
                ]
            })                
            const page = await browser.newPage();

            // Browse to the register page
            await page.goto("https://reserve.pokemon-cafe.jp/reserve/step1", {waitUntil: 'networkidle0'})

            // If there's no dropdown, then the page did not load properly
            try {
                await page.$('.select select')
                await Promise.all([
                    page.waitForNavigation({waitUntil: 'networkidle0'}),
                    page.select('.select select', '2')
                ])
            } catch (error) {
                console.log("No Number of Guests dropdown detected")
                await browser.close()
            }

            const selector = "#step2-form > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) > div > li.calendar-day-cell:nth-child(4)"

            try {
                await page.$(selector)
                await page.click(selector)
                await Promise.all([
                    page.waitForNavigation({waitUntil: 'networkidle0'}),
                    page.click('#submit_button')                    
                ])
            } catch (error) {
                console.log("No calendar detected")
                await browser.close()
            }

            try {
                await page.click('#time_table a.post-link')
                foundTimeslot = true
                console.log("Found a timeslot!")                
            } catch (error) {
                console.log("No time slot available (or wrong page)")
                await browser.close()
            }
        } catch (error) {
            console.log(error)
            await browser.close()
        }            
    }
}

const screenWidth = 2460
const screenHeight = 1440

for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        run(screenWidth, screenHeight, row, col)
    }
}