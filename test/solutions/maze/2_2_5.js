module.exports = {
  app: "maze",
  levelFile: "levels",
  levelId: "2_2_5",
  tests: [
    {
      description: "Top solution: MoveForward, MoveForward, TurnRight, MoveForward",
      expected: {
        result: true,
        testResult: 100
      },
      missingBlocks: [],
      xml: '<xml><block type="maze_moveForward"><next><block type="maze_moveForward"><next><block type="maze_turn"><title name="DIR">turnRight</title><next><block type="maze_moveForward"></block></next></block></next></block></next></block></xml>'
    }
  ]
};
