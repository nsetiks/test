import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ArticleService } from './article.service';
import { Article } from './article';

@Component({
   selector: 'app-article',
   templateUrl: './article.component.html',
   styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
   // Component properties
   allArticles: Article[];
   statusCode: number;
   requestProcessing = false;
   articleIdToUpdate = null;
   processValidation = false;
   // Create form
   articleForm = new FormGroup({
       title: new FormControl('', Validators.required),
       category: new FormControl('', Validators.required)
   });
  // Survey Create form
   surveyForm = new FormGroup({
       title: new FormControl('', Validators.required),
       category: new FormControl('', Validators.required)
   });
   // Create constructor to get service instance
   constructor(private articleService: ArticleService) {
   }
   // Create ngOnInit() and and load articles
   ngOnInit(): void {
     this.getAllArticles();
   }
   // Fetch all articles
   getAllArticles() {
        this.articleService.getAllArticles()
          .subscribe(
                data => this.allArticles = data,
                errorCode =>  this.statusCode = errorCode);
   }
   // Handle create and update article
   onArticleFormSubmit() {
     this.processValidation = true;
     if (this.articleForm.invalid) {
       return; // Validation failed, exit from method.
     }
	  // Form is valid, now perform create or update
      this.preProcessConfigurations();
     const title = this.articleForm.get('title').value.trim();
      const category = this.articleForm.get('category').value.trim();
     if (this.articleIdToUpdate === null) {
	    // Handle create article
       const article = new Article(null, title, category, null, null);
       this.articleService.createArticle(article)
         .subscribe(successCode => {
           this.statusCode = successCode;
           this.getAllArticles();
           this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);
     } else {
   	    // Handle update article
       const article = new Article(this.articleIdToUpdate, title, category, null, null);
       this.articleService.updateArticle(article)
         .subscribe(successCode => {
           this.statusCode = successCode;
           this.getAllArticles();
           this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);
     }
   }
  // Handle create and update survey
   onSurveyFormSubmit() {
     this.articleIdToUpdate = null;
     this.processValidation = true;
     if (this.surveyForm.invalid) {
       return; // Validation failed, exit from method.
     }
    // Form is valid, now perform create or update survey
      this.preProcessConfigurations();
     const title = this.surveyForm.get('title').value.trim();
      const category = this.surveyForm.get('category').value.trim();
     if (this.articleIdToUpdate === null) {
      // Handle create article
       const article = new Article(null, title, category, name, null );
       this.articleService.createArticle(article)
         .subscribe(successCode => {
           this.statusCode = successCode;
           this.getAllArticles();
           this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);
     } else {
        // Handle update survey
       const article = new Article(this.articleIdToUpdate, title, category, null, null);
       this.articleService.updateArticle(article)
         .subscribe(successCode => {
           this.statusCode = successCode;
           this.getAllArticles();
           this.backToCreateArticle();
         },
           errorCode => this.statusCode = errorCode);
     }
   }
   // Load article by id to edit
   loadArticleToEdit(articleId: string) {
      this.articleService.getArticleById(articleId)
        .subscribe(article => {
          this.articleIdToUpdate = article.articleId;
          this.articleForm.setValue({ title: article.title, category: article.category });
          this.surveyForm.setValue({ title: article.title, category: article.category, name: ' ' });
          this.processValidation = false;
          this.requestProcessing = false;
        },
          errorCode =>  this.statusCode = errorCode);
   }
   // Delete article
   deleteArticle(articleId: string) {
      this.preProcessConfigurations();
      this.articleService.deleteArticleById(articleId)
        .subscribe(successCode => {
          this.statusCode = successCode;
          this.getAllArticles();
          this.backToCreateArticle();
        },
          errorCode => this.statusCode = errorCode);
   }
   // Perform preliminary processing configurations
   preProcessConfigurations() {
      this.statusCode = null;
      this.requestProcessing = true;
   }
   // Go back from update to create
   backToCreateArticle() {
      this.articleIdToUpdate = null;
      this.articleForm.reset();
      this.surveyForm.reset();
      this.processValidation = false;
   }
  // Go back to submit survey form
   backToCreateSurvey() {
      this.articleIdToUpdate = true;
      this.processValidation = false;
   }
}
