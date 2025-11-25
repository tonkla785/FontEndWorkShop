import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/userservice';
import { User } from '../interface/userinterface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  chartCircle: any;
  chartStack: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.refreshCharts();

    this.userService.usersChanged$.subscribe(() => {
      this.refreshCharts();
    });
  }

  refreshCharts() {
    this.loadUserDataCharCircle();
    this.loadUserDataChartStack();
  }

  loadUserDataCharCircle() {
    this.userService.getUsers().subscribe((users: User[]) => {
      const maleCount = users.filter((u) => u.gender === 'ชาย').length;
      const femaleCount = users.filter((u) => u.gender === 'หญิง').length;
      const otherCount = users.length - maleCount - femaleCount;

      this.chartCircle = {
        title: {
          text: 'จำนวนผู้ใช้งานตามเพศ',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'เพศ',
            type: 'pie',
            radius: '50%',
            data: [
              { value: maleCount, name: 'ชาย' },
              { value: femaleCount, name: 'หญิง' },
              { value: otherCount, name: 'อื่นๆ' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    });
  }

  loadUserDataChartStack() {
    this.userService.getUsers().subscribe((users: User[]) => {

      const ageRanges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51+'];
      const maleCounts = new Array(ageRanges.length).fill(0);
      const femaleCounts = new Array(ageRanges.length).fill(0);
      const otherCounts = new Array(ageRanges.length).fill(0);

      users.forEach((u) => {
        let idx = 0;
        if (u.age <= 10) idx = 0;
        else if (u.age <= 20) idx = 1;
        else if (u.age <= 30) idx = 2;
        else if (u.age <= 40) idx = 3;
        else if (u.age <= 50) idx = 4;
        else idx = 5;

        if (u.gender === 'ชาย') maleCounts[idx]++;
        else if (u.gender === 'หญิง') femaleCounts[idx]++;
        else otherCounts[idx]++;
      });

      this.chartStack = {
        title: {
          text: 'จำนวนผู้ใช้งานตามช่วงอายุและเพศ',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['ชาย', 'หญิง', 'อื่นๆ'],
          top: 30,
        },
        xAxis: {
          type: 'category',
          data: ageRanges,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'ชาย',
            type: 'bar',
            stack: 'total',
            data: maleCounts,
          },
          {
            name: 'หญิง',
            type: 'bar',
            stack: 'total',
            data: femaleCounts,
          },
          {
            name: 'อื่นๆ',
            type: 'bar',
            stack: 'total',
            data: otherCounts,
          },
        ],
      };
    });
  }
}
