// https://www.themealdb.com/api.php

const mealsContainer = document.querySelector(".meals-container");
const favList = document.querySelector(".favorite-meals");
const searchTerm = document.querySelector("#search-term");
const searchBtn = document.querySelector("#search");
const mealPopUp = document.querySelector("#meal-popup");
const popUpCloseBtn = document.querySelector("#close-poptup");
const mealInfo = document.querySelector(".meal-info");
const mealBox = document.querySelector(".meal");

getRandomMeal();
fetchFavMeals();


async function getMealById(id){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const responseData = await response.json();
    const meal=responseData.meals[0];
    return meal;
}


async function getMealBySearch(term){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);
    const responseData = await response.json();
    const meal= responseData.meals;
    return meal;
}

async function getRandomMeal(){
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const responseData = await response.json();
    const ramdomMeal = responseData.meals[0];
    console.log(ramdomMeal)
    
    if(!response.ok){
        throw new Error(response.status);
    }

    addMeal(ramdomMeal, true);
}

function addMeal(mealData, random=false){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    
    meal.innerHTML = `
            <div class="meal-header">
            ${random ? `<span class="random">Recipe of the Day</span>` : ''}
                <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            </div>
            <div class="meal-body">
                <h4>${mealData.strMeal}</h4>
                <button class="fav-button"><i class="fas fa-heart"></i></button>
            </div>
    `;

    mealsContainer.appendChild(meal);

    // 하트 클릭 meal 이 생성된 후 meal에 이벤트 delegation해서 버튼을 선택해야 한다
    // document로 찍으면 검색에 나오는 항목 중 선택한것만 붙는게 아니라 전부 favList로 붙음 
    const favBtn = meal.querySelector(".fav-button");

    favBtn.addEventListener("click", (event)=>{
        if(favBtn.matches(".active")){
            favBtn.classList.remove("active");
            removeMealsFromLocalStorage(mealData.idMeal);
        } else {
            favBtn.classList.add("active");
            addMealstoLocalStorage(mealData.idMeal);
        }
        event.stopPropagation();
    
        //하트 클릭하면 favMeal을 불러오도록
        fetchFavMeals();
    })


    // 해당 음식 클릭하면  음식 정보 팝업을 띄운다 
    meal.addEventListener("click", ()=>{
        showMealInfo(mealData);
    })

    
}

// 하트 클릭한 데이터를 favorite meal로 올려야 한다 
function addMealstoLocalStorage(mealId){
    const mealIds = getMealsFromLocalStorage();
    localStorage.setItem('mealId', JSON.stringify([...mealIds, mealId]));
}

function removeMealsFromLocalStorage(mealId){
    const mealIds = getMealsFromLocalStorage();
    // console.log(mealIds.filter(id=> id === mealId)) // 해당 값
    // console.log(mealIds.filter(id => id !== mealId)) // 해당 값을 제외한 모든 값
    // 해당 아이디를 제외한 모든 값을 filter한다 
    localStorage.setItem('mealId', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsFromLocalStorage(){
    const mealIds = JSON.parse(localStorage.getItem('mealId'));
    // 처음에는 로컬스토리지가 null 이므로  null일경우 빈 배열을 가지고 오고 아니면 mealIds를 가져와라 
    return mealIds === null ? [] : mealIds;
}



// 좋아요 누른 음식의 아이디와 getMealById random을 사용해 음식을 불러온다 
async function fetchFavMeals(){

    // clean the container
    favList.innerHTML = '';

    const mealIds = getMealsFromLocalStorage();

    // const meals = []; 

    for(const item of mealIds){
        const mealId = item;
        let meal = await getMealById(mealId);
        // meals.push(meal);
        // add them to the screen 
        addMealToFavorite(meal);
    }
}

// 좋아요 누른 음식을 보여준다 
function addMealToFavorite(mealData){
    console.log(mealData)
    const favLi = document.createElement('li');


    favLi.innerHTML = 
    `
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const delBtn = favLi.querySelector(".clear");

    delBtn.addEventListener("click", (event)=>{
        removeMealsFromLocalStorage(mealData.idMeal);
        fetchFavMeals();
        event.stopPropagation();
    })

    
    favLi.addEventListener("click", ()=>{
        showMealInfo(mealData);
        
    })
    favList.appendChild(favLi);
}


function showMealInfo(mealData){
    // clean it up 
    mealInfo.innerHTML = '';

    // update the Meal info
    const mealEl = document.createElement("div");

    // Get all 20 ingredients / measures 
    const ingredients = [];

    for(let i=0; i<=20; i++){
        if(mealData['strIngredient'+i]) {
            ingredients.push(`${mealData['strIngredient'+i]} / ${mealData['strMeasure'+i]}`);
        } 
    }
    console.log(mealData['strIngredient1'])
    // console.log(mealData['strIngredient'+1])
    console.log(ingredients.map(ing=> `<li>${ing}</li>`))
    console.log(ingredients.map(ing=> `<li>${ing}</li>`).join(''))

    mealEl.innerHTML = `
        <h1 class="meal-title">${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="">
        <p class="meal-instruction">${mealData.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
    `
    mealInfo.appendChild(mealEl);

    //show popup
    mealPopUp.classList.remove("hidden");
}




// 검색 버튼  
// promise pending 문제로 aync 익명함수 await 호출함수 적용  
searchBtn.addEventListener("click",  async()=>{
    //이전에 검색한 데이터가 쌓이지 않게 초기화
    mealsContainer.innerHTML= '';
    let search = searchTerm.value;
    const meals = await getMealBySearch(search);

    if(meals) {
        for(const item of meals){
            addMeal(item);
        }
    }
})



//  팝업 닫기 
popUpCloseBtn.addEventListener("click", ()=>{
    mealPopUp.classList.add("hidden")
})
// ingredient , 
