# 🏫 Duck, Cover & Hold — Enhanced Classroom Edition

A professional Phaser.js-based earthquake drill game with enhanced features and realistic classroom environment.

## 🎮 Enhanced Game Features

- **Professional UI** with clean, modern design and control indicators
- **16 desks in 4 rows** (4×4 grid) - realistic classroom layout
- **Mario-style character** with walking and ducking animations
- **Complete classroom environment** with blackboard, light blue windows with panels, and classroom gate/door
- **All-direction movement** - move up, down, left, right with arrow keys
- **Duck controls** - press SHIFT to duck and protect yourself
- **Falling objects** (books) during earthquake simulation
- **Screen shake effects** for earthquake realism
- **15-second timer** with countdown display
- **Hold mechanic** - must hold SPACE while under desk
- **Visual feedback** - green glow when safely holding under desk
- **Success/failure feedback** with clear messaging

## 🚀 Quick Start

1. **Access the game**: http://localhost:8080
2. **Click "Start Drill"** to begin
3. **Use arrow keys** to move in all directions
4. **Press SHIFT** to duck and protect yourself
5. **Get under any desk** when earthquake starts
6. **Hold SPACE** while under the desk until timer ends

## 🎮 Enhanced Controls

- **Arrow Keys** → Move in all directions (up, down, left, right)
- **SHIFT** → Duck down to protect yourself
- **SPACE** → Hold while under desk for safety
- **Mouse** → Click buttons for navigation

## 🏫 Classroom Features

### Enhanced Environment:
- ✅ **Light blue windows** with realistic panels and frames
- ✅ **Classroom gate/door** with window and handle
- ✅ **4 rows of desks** (16 total safe zones)
- ✅ **Detailed blackboard** with chalk writing
- ✅ **Realistic floor and ceiling**

### Character Features:
- ✅ **All-direction movement** - no longer limited to left/right
- ✅ **Ducking animation** - character crouches when pressing SHIFT
- ✅ **Walking animations** - character moves naturally
- ✅ **Visual feedback** - green glow when safely holding under desk

## 📁 Project Structure

```
earthquake_drill2.O/
├── index.html          # Enhanced game page with controls
├── style.css           # Professional styling with control indicators
├── game.js            # Complete enhanced game logic
├── README.md          # This file
└── assets/            # Game assets folder
    └── README.md      # Asset requirements
```

## 🎯 Enhanced Gameplay

1. **Preparation Phase**: Move around the classroom with arrow keys in all directions
2. **Duck Practice**: Press SHIFT to practice ducking
3. **Earthquake Starts**: Screen shakes, books fall, timer begins (15 seconds)
4. **Get to Safety**: Move under any of the 16 desks
5. **Duck and Hold**: Duck down (SHIFT) and hold SPACE while under desk
6. **Visual Feedback**: Green glow appears when safely holding
7. **Result**: See if you survived the earthquake drill!

## 🎨 Customization

### Adding Real Assets
Place these files in the `assets/` folder:
- `classroom_bg.png` - Enhanced classroom background (900×600)
- `desk.png` - Desk sprite with transparent background
- `student_spritesheet.png` - Character spritesheet (32×48 per frame)
- `book.png` - Falling book sprite
- `quake.mp3` - Earthquake sound effect

### Free Asset Sources
- **Kenney.nl** - High-quality free game assets
- **OpenGameArt.org** - Community-created assets
- **Itch.io** - Free asset packs

## 🛠️ Technical Enhancements

- **Framework**: Phaser.js 3.60.0
- **Physics**: Enhanced arcade physics with all-direction movement
- **Graphics**: Programmatically generated placeholders with enhanced details
- **Animations**: Walking, ducking, and idle animations
- **Responsive**: Adapts to different screen sizes
- **Visual Feedback**: Real-time safety indicators

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🏆 Educational Value

This enhanced game teaches the complete **"Duck, Cover, Hold"** earthquake safety procedure:
- **Duck**: Press SHIFT to duck down and protect yourself
- **Cover**: Get under a sturdy piece of furniture (desk)
- **Hold**: Hold on (SPACE) until the shaking stops

Perfect for:
- Schools and educational institutions
- Emergency preparedness training
- Family safety education
- Corporate safety drills

## 🔧 Development

### Running Locally
```bash
# Start server
python3 -m http.server 8080

# Access game
http://localhost:8080
```

### Key Enhancements Made:
- **All-direction movement** - character can move up, down, left, right
- **Duck controls** - SHIFT key to duck and protect
- **Enhanced classroom** - light blue windows with panels, classroom gate
- **More desks** - 16 desks in 4 rows for better gameplay
- **Visual feedback** - green glow when safely holding under desk
- **Better animations** - ducking, walking, and idle states
- **Longer timer** - 15 seconds instead of 10 for better gameplay

## 📄 License

This project is open source and available for educational use.

---

**Ready to play the enhanced version?** Open http://localhost:8080 and experience the complete earthquake drill simulation! 🚀
