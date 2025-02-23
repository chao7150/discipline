export interface TaskList {
  起床: {
    時: number;
    分: number;
  };
  散歩: {
    実施: boolean;
    ゴミ拾い: boolean;
    犬遭遇: {
      数: number;
      備考: string;
    };
  };
  朝食: {
    三色食品群のうち: number;
  };
  体操: boolean;
  労働: {
    passion: number;
    discipline: number;
    備考: string;
  };
  ジム: '有酸素+筋トレ' | '有酸素' | '休養日' | 'サボった';
  勉強会: boolean;
  個人開発: boolean;
  あすけん: number;
}
