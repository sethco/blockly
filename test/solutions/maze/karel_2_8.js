module.exports = {
  app: "maze",
  levelFile: "karelLevels",
  levelId: "2_8",
  tests: [
    {
      description: "Top Solve: 3x { avoid and remove }",
      expected: {
        result: true,
        testResult: 100,
      },
      missingBlocks: [],
      xml: '<xml><block type="controls_repeat"><title name="TIMES">3</title><statement name="DO"><block type="procedures_callnoreturn"><mutation name="avoid the cow and remove 1"></mutation></block></statement></block><block type="procedures_defnoreturn" deletable="false" editable="false"><mutation></mutation><title name="NAME">avoid the cow and remove 1</title><statement name="STACK"><block type="maze_turn" deletable="false" movable="false" editable="false"><title name="DIR">turnLeft</title><next><block type="maze_moveForward" deletable="false" movable="false" editable="false"><next><block type="maze_turn" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><next><block type="maze_moveForward" deletable="false" movable="false" editable="false"><next><block type="maze_moveForward" deletable="false" movable="false" editable="false"><next><block type="maze_turn" deletable="false" movable="false" editable="false"><title name="DIR">turnRight</title><next><block type="maze_moveForward" deletable="false" movable="false" editable="false"><next><block type="maze_dig" deletable="false" movable="false" editable="false"><next><block type="maze_turn" deletable="false" movable="false" editable="false"><title name="DIR">turnLeft</title></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>'
    }
  ]
};