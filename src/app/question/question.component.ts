import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionServiceService } from '../service/question-service.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name: string = "";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number =0;
  inCorrectAnswer: number =0;
  interval$: any; 
  progress:string = "0";
  isQuizCompleted: boolean = false;

  constructor(private questionService: QuestionServiceService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
  }

  getAllQuestion() {
    this.questionService.getQuestionJson().subscribe(
      res =>{
        this.questionList = res.questions; 
            }
    )
  }

  nextQuestion(){
    this.currentQuestion++
  }

  previous (){
    this.currentQuestion--
  }

  answer(currentQuestion:number, option:any){
   
    if(this.currentQuestion === this.questionList.length){
      this.isQuizCompleted =true; 
      this.stopCounter();
    }

    if(option.correct){
      this.points +=10;
      this.correctAnswer++;
      setTimeout(() =>{
      this.currentQuestion++
      this.counter =60;
      this.getProgressPercent();
      }, 300);
    } else{
      setTimeout( ()=> {
      this.inCorrectAnswer++;
      this.currentQuestion++
      this.counter =60;
      this.getProgressPercent();
      }, 300);
      this.points -=10;
    }
  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if(this.counter===0){
        this.currentQuestion++;
        this.counter=60;
        this.points -=10;
      } 
    });
    setTimeout(() => {
      this.interval$.unsubcribe();
    }, 600000);
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter =0;
  }

  resetCounter(){
    this.stopCounter();
    this.counter =60;
    this.startCounter();
  }

  resetQuiz()
  {
    this.resetCounter();
    this.getAllQuestion();
    this.currentQuestion=0;
    this.counter=60;
    this.points=0;
    this.progress= "0";
  }

  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }


}
