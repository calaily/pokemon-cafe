const puppeteer = require("puppeteer");

const MAX_ROWS = 3
const MAX_COLS = 3

async function run(screenWidth, screenHeight, row, col) {
    const width = (screenWidth / MAX_COLS)
    const height = (screenHeight / MAX_ROWS)
    const positionX = (row * width)
    const positionY = (col * height)    

    const browser = await puppeteer.launch({headless: false, args: [`--window-position=${positionX},${positionY}`, `--window-size=${width},${height}`]})
    const selector = "#step2-form > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) > div > li.calendar-day-cell:nth-child(3)"

    try {
        const page = await browser.newPage()
        await page.setViewport({width: 1500, height: 1024})

        await page.goto("https://reserve.pokemon-cafe.jp/reserve/step1")
        
        // Select 2 from the dropdown
        await page.waitForSelector('.select select')
        await page.select('.select select', '2')

        // Click the date in the calendar
        await page.waitForSelector(selector)
        await page.click(selector)

        // Click the "Next Step" button
        await page.click('#submit_button')

        await page.waitForSelector('#time_table')
        await page.click('#time_table a.post-link')
    } 
    
    catch (error) {
        browser.close()
    }
}

const screenWidth = 2460
const screenHeight = 1440

for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
       run(screenWidth, screenHeight, row, col)
    }
}