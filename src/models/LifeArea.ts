class LifeArea {
  id: number;
  name: string;
  vision: string;
  plan: string;
  constructor(
    id: number,
    name: string,
    vision: string = "",
    plan: string = ""
  ) {
    this.id = id;
    this.name = name;
    this.vision = vision;
    this.plan = plan;
  }
}

export default LifeArea;
