const puppeteer = require('puppeteer');

const loginlink = 'https://internshala.com/login/user';
const email = 'abc@gmail.com';
const password = '0123456789';
const profile = 'Backend Development';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-features=site-per-process'],
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto(loginlink, { waitUntil: 'networkidle2' });

    await page.type("input[id='email']", email, { delay: 50 });
    await page.type("input[id='password']", password, { delay: 50 });
    await page.click("button[id='login_submit']", { delay: 50 });

    // Navigate to the internships page
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Logged IN');
    await page.click(".nav-item.internship_container_hover.dropdown.dropdown-hover.dropdown_backdrop a[id='internships_new_superscript']", { delay: 50 });
    console.log('Internship tab Clicked');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const all_internships = await page.$$('.container-fluid.individual_internship.view_detail_button.visibilityTrackerItem');

    let pageCount = 3;
    const hrefs = [];

    for (const internship of all_internships) {
        if (pageCount == 0) break;


        const dataHref = await page.evaluate(element => element.getAttribute('data-href'), internship);
        const internshipUrl = `https://internshala.com${dataHref}`

        let internshipPage = await browser.newPage();
        await internshipPage.goto(internshipUrl, { waitUntil: 'networkidle2' });
        console.log('Specific Internship Clicked.');


        await internshipPage.waitForSelector('.buttons_container');
        const applyHref = await internshipPage.evaluate(() => {
            const container = document.querySelector('.buttons_container');
            const aTag = container.querySelector('a');
            console.log(aTag);
            return aTag ? aTag.href : null;
        });

        await internshipPage.goto(applyHref, { waitUntil: 'networkidle2' });
        console.log('Apply Button Clicked');

        await internshipPage.click(".btn.btn-large.education_incomplete.proceed-btn", { delay: 50 });
        await internshipPage.waitForNavigation({ waitUntil: 'networkidle2' });
        console.log('Proceed to Application Btn Clicked');

        // const containerHTML = await internshipPage.evaluate(() => {
        //     const container = document.querySelector('.proceed-btn-container');
        //     return container ? container.innerHTML : 'Container not found';
        // });
        // console.log('Container inner HTML:', containerHTML);

        try{
            await internshipPage.click(".copyCoverLetterTitle", { delay: 50 }); 
        }catch(err){
            console.log('Coverletter Box not available.');
        }

        try{
            await internshipPage.click("#check", { delay: 50 });      
        }catch(err){
            console.log('CheckBox for relocation not available.');
        }


        try{
            await internshipPage.click("#submit", { delay: 150 });
            console.log('Submit Btn Clicked')
            --pageCount;
        }catch(err){
            console.log("Doesn't let Submit Btn Clicked");
            continue;
        }

        // await internshipPage.waitForNavigation({ waitUntil: 'networkidle2' });
        
        
    }

})();
