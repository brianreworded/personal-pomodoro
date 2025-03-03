// Workout type definitions
export const WORKOUT_TYPES = {
  STRETCHES: 'stretches',
  YOGA: 'yoga',
  CALISTHENICS: 'calisthenics'
};

// Exercise data with descriptions
export const workoutExercises = {
  [WORKOUT_TYPES.STRETCHES]: [
    { 
      name: 'Butterfly Stretch', 
      difficulty: 1,
      description: 'Sit with the soles of your feet together, knees out to the sides. Gently press knees toward the floor while keeping your back straight.'
    },
    { 
      name: 'Hamstring Stretch', 
      difficulty: 1,
      description: 'Sit with one leg extended, the other bent with foot against inner thigh. Reach toward your toes while keeping your back straight.'
    },
    { 
      name: 'Neck Rolls', 
      difficulty: 1,
      description: 'Slowly roll your head in a circular motion, first clockwise then counterclockwise. Keep movements gentle and controlled.'
    },
    { 
      name: 'Arm Circles', 
      difficulty: 1,
      description: 'Extend arms out to sides and make small circular motions, gradually increasing to larger circles. Reverse direction halfway through.'
    },
    { 
      name: 'Hip Flexor Stretch', 
      difficulty: 2,
      description: 'From a lunge position, lower back knee to ground. Push hips forward while keeping torso upright to feel stretch in front of hip.'
    },
    { 
      name: 'Shoulder Stretch', 
      difficulty: 2,
      description: 'Bring one arm across your chest, use opposite hand to gently pull elbow closer to body. Hold, then switch sides.'
    },
    { 
      name: 'Quad Stretch', 
      difficulty: 2,
      description: 'Standing on one leg, grab opposite foot behind you. Pull heel toward buttocks while keeping knees aligned and core engaged.'
    },
    { 
      name: 'Wrist Stretch', 
      difficulty: 1,
      description: 'Extend one arm forward, palm up. Use opposite hand to gently pull fingers toward body. Reverse with palm down. Repeat on both sides.'
    },
    { 
      name: 'Calf Stretch', 
      difficulty: 1,
      description: 'Stand facing a wall with hands at eye level. Step one foot back, press heel into floor while keeping leg straight. Feel stretch in calf.'
    },
    { 
      name: 'Chest Opener', 
      difficulty: 2,
      description: 'Clasp hands behind your back, straighten arms and lift them while squeezing shoulder blades together and lifting chest.'
    },
    { 
      name: 'Seated Spinal Twist', 
      difficulty: 2,
      description: 'Sit with legs extended, bend one knee and cross over other leg. Twist torso toward bent knee, using arm as leverage on outside of thigh.'
    },
    { 
      name: 'Standing Side Bend', 
      difficulty: 1,
      description: 'Stand with feet hip-width apart, raise one arm overhead and lean to opposite side. Keep both feet grounded and hips facing forward.'
    },
    { 
      name: 'Figure Four Stretch', 
      difficulty: 3,
      description: 'Lie on back, cross one ankle over opposite knee. Grab behind uncrossed thigh and pull toward chest to stretch hip and glute.'
    },
    { 
      name: 'Wrist and Finger Extensions', 
      difficulty: 1,
      description: 'Extend arm with palm facing up, use other hand to gently pull fingers back. Hold, then spread fingers wide against resistance.'
    },
    { 
      name: 'Ankle Rotations', 
      difficulty: 1,
      description: 'Seated with one leg extended, rotate ankle clockwise 10 times, then counterclockwise. Point and flex foot to complete.'
    }
  ],
  [WORKOUT_TYPES.YOGA]: [
    { 
      name: 'Downward Dog', 
      difficulty: 2,
      description: 'From hands and knees, lift hips up and back forming an inverted V. Press heels toward floor and relax head between arms.'
    },
    { 
      name: 'Warrior I Pose', 
      difficulty: 2,
      description: 'From standing, step one foot back and turn it 45°. Bend front knee over ankle, raise arms overhead with palms facing each other.'
    },
    { 
      name: 'Child\'s Pose', 
      difficulty: 1,
      description: 'Kneel on floor, touch big toes together, sit on heels, then bow forward with arms extended or rest them alongside body.'
    },
    { 
      name: 'Cat-Cow Stretch', 
      difficulty: 1,
      description: 'Start on hands and knees. Inhale, drop belly and lift head (cow). Exhale, arch back and tuck chin (cat). Flow between positions.'
    },
    { 
      name: 'Tree Pose', 
      difficulty: 3,
      description: 'Stand on one leg, place sole of other foot on inner thigh (not on knee). Bring palms together at heart or extend arms overhead.'
    },
    { 
      name: 'Mountain Pose', 
      difficulty: 1,
      description: 'Stand with feet together, distribute weight evenly. Engage leg muscles, tuck tailbone, and reach crown of head up. Arms at sides.'
    },
    { 
      name: 'Bridge Pose', 
      difficulty: 2,
      description: 'Lie on back with knees bent, feet flat and hip-width apart. Press into feet to lift hips. Clasp hands under body or keep arms alongside.'
    },
    { 
      name: 'Cobra Pose', 
      difficulty: 2,
      description: 'Lie face down, hands under shoulders. Press tops of feet down, engage legs, and lift chest while keeping lower ribs on the floor.'
    },
    { 
      name: 'Warrior II Pose', 
      difficulty: 2,
      description: 'Step feet wide apart, turn one foot out 90°. Bend knee over ankle, extend arms parallel to floor, gaze over front hand.'
    },
    { 
      name: 'Triangle Pose', 
      difficulty: 3,
      description: 'From wide stance with front foot turned out, extend torso over front leg, reaching front hand to shin/ankle/floor and top hand to ceiling.'
    },
    { 
      name: 'Chair Pose', 
      difficulty: 3,
      description: 'Stand with feet together or hip-width apart, bend knees as if sitting in a chair, reach arms up alongside ears.'
    },
    { 
      name: 'Extended Side Angle', 
      difficulty: 3,
      description: 'From Warrior II, lower front forearm to thigh (or hand to floor) and extend top arm alongside ear, creating a straight line.'
    },
    { 
      name: 'Easy Seated Pose', 
      difficulty: 1,
      description: 'Sit cross-legged with hands on knees. Lengthen spine, relax shoulders, and breathe deeply. Great for meditation.'
    },
    { 
      name: 'Half Pigeon Pose', 
      difficulty: 4,
      description: 'From hands and knees, bring one shin forward parallel to top of mat. Extend other leg back, lower hips. Fold forward for deeper stretch.'
    },
    { 
      name: 'Corpse Pose', 
      difficulty: 1,
      description: 'Lie flat on back with arms at sides, palms up. Allow feet to fall open. Close eyes and focus on completely relaxing the body.'
    },
    { 
      name: 'Happy Baby Pose', 
      difficulty: 2,
      description: 'Lie on back, grip outsides of feet with hands, knees toward armpits. Gently rock side to side to massage spine.'
    }
  ],
  [WORKOUT_TYPES.CALISTHENICS]: [
    { 
      name: 'Push-ups', 
      difficulty: 3,
      description: 'Start in plank position with hands shoulder-width apart. Lower chest to floor by bending elbows, then push back up. Keep body straight.'
    },
    { 
      name: 'Sit-ups', 
      difficulty: 2,
      description: 'Lie on back with knees bent, feet flat. Cross arms over chest or place hands behind head. Curl up until torso is vertical, then lower back down.'
    },
    { 
      name: 'Squats', 
      difficulty: 2,
      description: 'Stand with feet shoulder-width apart. Bend knees and lower hips as if sitting in a chair. Keep chest up and heels on floor.'
    },
    { 
      name: 'Lunges', 
      difficulty: 2,
      description: 'From standing, step one foot forward and lower back knee toward floor. Front knee should be above ankle. Push back to starting position.'
    },
    { 
      name: 'Jumping Jacks', 
      difficulty: 1,
      description: 'Start standing with feet together, arms at sides. Jump feet apart while raising arms overhead, then jump back to starting position.'
    },
    { 
      name: 'Plank', 
      difficulty: 3,
      description: 'Hold a push-up position with body in straight line from head to heels. Engage core, keep shoulders down and back straight.'
    },
    { 
      name: 'Mountain Climbers', 
      difficulty: 3,
      description: 'Start in plank position. Rapidly alternate bringing knees toward chest, as if running in place while keeping hands on floor.'
    },
    { 
      name: 'Burpees', 
      difficulty: 4,
      description: 'From standing, drop to squat, kick feet back to plank, perform a push-up, jump feet forward to squat, then jump up with hands overhead.'
    },
    { 
      name: 'Bicycle Crunches', 
      difficulty: 2,
      description: 'Lie on back, hands behind head, knees bent. Alternate touching elbow to opposite knee while extending other leg, in a pedaling motion.'
    },
    { 
      name: 'Glute Bridges', 
      difficulty: 1,
      description: 'Lie on back with knees bent, feet flat. Press into feet to lift hips toward ceiling, squeezing glutes at top. Lower and repeat.'
    },
    { 
      name: 'Tricep Dips', 
      difficulty: 3,
      description: 'Sit on edge of chair/bench, hands gripping edge. Slide buttocks off front with legs extended. Bend elbows to lower body, then press up.'
    },
    { 
      name: 'Wall Sits', 
      difficulty: 2,
      description: 'Stand with back against wall, feet shoulder-width apart. Slide down until thighs are parallel to floor, knees at 90°. Hold position.'
    },
    { 
      name: 'Russian Twists', 
      difficulty: 3,
      description: 'Sit with knees bent, feet lifted. Lean back slightly, hands together. Rotate torso to touch hands to floor on each side alternately.'
    },
    { 
      name: 'Superman', 
      difficulty: 2,
      description: 'Lie face down with arms extended overhead. Simultaneously lift arms, chest, and legs off floor. Hold briefly, then lower.'
    },
    { 
      name: 'Diamond Push-ups', 
      difficulty: 4,
      description: 'Perform push-up with hands close together forming a diamond shape with thumbs and index fingers. Focuses on triceps.'
    },
    { 
      name: 'High Knees', 
      difficulty: 2,
      description: 'Stand in place and run, bringing knees up to hip level. Pump arms for additional intensity. Focus on speed and height.'
    }
  ]
};