import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from './../../services/data.service'
import { ITrainee, IGrade, ISubjects } from './../interface'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-create-trainee',
  templateUrl: './create-trainee.component.html',
  styleUrls: ['./create-trainee.component.css']
})
export class CreateTraineeComponent implements OnInit, OnDestroy {
  updateOrSave: Boolean = true;
  sub: Subscription
  subjects: ISubjects[]
  trainee: ITrainee;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    public toast: ToastsManager,
    public vRef: ViewContainerRef) {
    this.toast.setRootViewContainerRef(vRef)
  }


  ngOnInit() {
    console.log("oninit")
    //getting the subject list async from server
    this.dataService.getSubjects().subscribe(res => {
      this.subjects = res
    })
    //getting snapshot of the url
    if (this.route.snapshot.params['id']) {
      //fetching data from server
      this.sub = this.dataService.getTraineeById(this.route.snapshot.params['id'])
        .subscribe((trainee) => {
          debugger
          this.trainee = trainee
          //getting one snapshot
        })
    }
    else {
      this.updateOrSave = false
      this.cleanForm()
    }
  }

  cleanForm() {
    this.trainee = {
      address: { city: "", country: "", street: "", zip: "" },
      dateJoin: "",
      email: "",
      id: "",
      name: "",
      grades: []
    }
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe() }
  }

  setTrainee() {
    debugger
    //assinging the data to a new object to avoid reuse
    let traineeToSet: ITrainee = Object.assign({}, this.trainee)
    this.dataService.setTrainee(traineeToSet)
      .then(() => { this.toast.success('trainee updated!', 'Success') })
      .catch((err) => { this.toast.error('could not update trainee', 'fail') })
  }

  addNew() {
    if (!this.trainee.grades) { this.trainee.grades = [] }
    //setting a new "empty row"
    setTimeout(() => {
      this.trainee.grades.push({
        date: "2016-11-30",
        score: 0,
        subject: { name: "" },
        // creating an injective key by the second.
        // in a real case i would push it to the DB to get a real injuctive key (or use a some outer libary)
        index: Date.now().toString()
      })
    }, 1000)
  }

}