import { Recipe } from "./../recipes/recipe.model";
import { RecipeService } from "./../recipes/recipe.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://recipe-shopping-project-a74c1-default-rtdb.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
  fetchRecipe() {
    return this.http
      .get(
        "https://recipe-shopping-project-a74c1-default-rtdb.firebaseio.com/recipes.json"
      )
      .pipe(
        map((recipes: Recipe[]) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            }; // Ensuring that ingredients property is set to empty array if its undefined
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
