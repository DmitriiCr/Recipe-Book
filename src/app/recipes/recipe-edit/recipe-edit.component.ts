import { Subscription } from "rxjs";
import { ShoppingListService } from "./../../shopping-list/shopping-list.service";
import { RecipeService } from "./../recipe.service";
import { Recipe } from "./../recipe.model";
import { Params, Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit, AfterViewInit {
  recipe: Recipe;
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private serviceRecipe: RecipeService,
    private serviceShop: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
    this.recipe = this.serviceRecipe.getRecipe(this.id);
  }

  ngAfterViewInit(): void {}

  private initForm() {
    let recipeName = "";
    let recipeImagePath = "";
    let recipeDescription = "";
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.serviceRecipe.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe["ingredients"]) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.value["name"],
      this.recipeForm.value["description"],
      this.recipeForm.value["imagePath"],
      this.recipeForm.value["ingredients"]
    );
    if (this.editMode) {
      this.serviceRecipe.updateRecipe(this.id, newRecipe);
    } else {
      this.serviceRecipe.addRecipe(newRecipe);
    }
    // this.onCancel();
    console.log(this.recipeForm);
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onDeleteIngredients(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }
}
