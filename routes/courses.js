const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const Categories = require('../models/category');
const Courses = require('../models/course')
const puppeteer = require('puppeteer');
// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Courses.find().populate("category")
        res.json(courses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get filtered courses
router.get('/filtered', async (req, res) => {
    const whereClause = {}

    if (req.query.categories) {
        whereClause.category = { $in: req.query.categories }
    }

    if (req.query.price)
        whereClause.price = { $gte: req.query.price.min, $lte: req.query.price.max }

    if (req.query.rating)
        whereClause.rating = req.query.rating

    try {
        const courses = await Courses.find(whereClause)
        res.json(courses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Create new course
router.post('/', async (req, res) => {
    const course = new Courses(req.body.newCourse)

    try {
        const newCourse = await course.save()
        res.status(200).json(newCourse)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/scrap', async (req, res) => { res.json(await webScraper()) })
async function fetchText(page,idButton,selector,typeToSearch){
    let heading;
    let DataList = [];
    if(idButton.length > 0){
    heading = await page.$$(idButton);
    console.log(heading.length)
    heading[0].click();
    }
    heading = await page.$$(selector);
    for(let index = 0; index < heading.length;index++){
        let element = heading[index];
        let headingText;
        switch (typeToSearch){
        case "value":
        {
         headingText = await page.evaluate( element => element.value,element);
         break;
        }
        case "text" :{
            headingText = await page.evaluate( element => element.textContent,element);
            break;
        }
        case "href":{
            headingText = await page.evaluate( element => element.href,element);
            break;
        }
    }
        DataList.push(headingText);
    }
    return DataList;
}
async function webScraper()
{
    let CourseList = [];
    let DataList = [];
    let LinkList = [];
    let HeaderCourseList = [];
    let PriceCourseList = [];
    let DescriptionList = [];
    let AuthorList = [];
    const browser = await puppeteer.launch({});
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(180000)
    page.setDefaultTimeout(180000);
    await page.goto('https://www.edx.org/search?tab=course',{
        waitUntil:"networkidle0"
    });
    let catagoriesList = []
    console.log("Pass")
    for(let numberOfSubject = 0; numberOfSubject < 31; numberOfSubject++)
    {
         DataList = (await fetchText(page,"",`input[type = "checkbox"]#subject-${numberOfSubject}.pgn__form-checkbox-input`,"value"));
         catagoriesList.push(...DataList);
    }
    catagoriesList = deleteDuplicate(catagoriesList);
    
    // try {
    //     const newCategories = await categories.save()
    // } catch (err) {
    //     console.log("Nope")
    // }
    const categoriesExists = await Categories.find()
    for(let catgoryIndex = 0; catgoryIndex < catagoriesList.length; catgoryIndex++)
    {
        let newCategories;
        let saveNewCategory = true;
        categoriesExists.forEach((cat) =>{
            if(cat.name == catagoriesList[catgoryIndex])
            {
                newCategories = cat;
                saveNewCategory = false;
            }
        })
        if(saveNewCategory)
        {
            console.log("saving :" + catagoriesList[catgoryIndex])
            try
            {
                console.log("Try saving :" + catagoriesList[catgoryIndex])
                const categories = new Categories({name:catagoriesList[catgoryIndex]});
                newCategories = await categories.save()
            }
            catch (err) {
                console.log("could not save :" + catagoriesList[catgoryIndex])
            }
        }
        let catgory = encodeURIComponent(catagoriesList[catgoryIndex]);
        await page.goto(`https://www.edx.org/search?tab=course&subject=${catgory}`,{
            waitUntil:"networkidle0"
        });
        console.log("Finish: " + catgory);
        DataList = (await fetchText(page,"","a.discovery-card-link","href"));
        DataList.forEach((newCourse)=>
        {
            LinkList.push({category:newCategories._id, link: newCourse});
            // CourseList.push({name:newCourse,description:newCourse,price:0,category:newCategories._id,rating:4,author:"edx"});
        })
        
    }
    LinkList = deleteDuplicate(LinkList);
    console.log("Start Searching...",LinkList.length)
    for(let linkIndex = 0 ; linkIndex < 500; linkIndex++){
        await page.goto(LinkList[linkIndex].link,{
            waitUntil:"networkidle0"
        });
        HeaderCourseList = (await fetchText(page,"","div.header > div > div > div > h1","text"));
        PriceCourseList = (await fetchText(page,"","table.track-comparison-table > tbody > tr.tr > td.td > p.comparison-item","text"));
        DescriptionList = (await fetchText(page,"","div.header > div > div > div > div > p","text"));
        AuthorList = (await fetchText(page,"","div.at-a-glance> div > div > ul > li > a","text"));
        

        let price = (PriceCourseList[0])?PriceCourseList[0].match(/[\d\.]+/)[0]:0; //Undifined Is Like Free
        CourseList.push({name:HeaderCourseList[0],price:price,description:DescriptionList[0],
            category:LinkList[linkIndex].category, author:AuthorList[0],rating:4})
        if(linkIndex % 100 == 0){
        console.log("Finish" + linkIndex);
        }
        
    }
    CourseList = deleteDuplicate(CourseList);
    for(let courseIndex = 0; courseIndex< CourseList.length; courseIndex++){
    const course = new Courses(CourseList[courseIndex]);
    try {
        const newCourse = await course.save()
    }
    catch (err) {
        console.log("could not save :" + CourseList[courseIndex])
    }
}
    browser.close();
    return CourseList.length;

};
function deleteDuplicate(listOfitems){
    let unique = [];
    listOfitems.forEach((item) =>{if(!unique.includes(item)){unique.push(item)}});
    return unique;
}
module.exports = router