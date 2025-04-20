export interface TaskList {
  睡眠時間: {
    時間: number;
    分: number;
  };
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
  朝食の栄養カバレッジ: '0' | '1' | '2' | '3';
  体操: boolean;
  労働: {
    状態: 'した' | '休日';
    passion: number;
    discipline: number;
    備考: string;
  };
  ジム: '有酸素+筋トレ' | '有酸素' | '休養日' | 'サボった';
  勉強会: boolean;
  個人開発: boolean;
  あすけん: number;
}
