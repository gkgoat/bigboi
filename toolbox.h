// toolbox.h:
//
// === NOTES ===
// * This is a _small_ set of typedefs, #defines and inlines that can
//   be found in tonclib, and might not represent the
//   final forms.


#ifndef TOOLBOX_H
#define TOOLBOX_H

// === (from tonc_types.h) ============================================

typedef unsigned char   u8;
typedef unsigned short  u16;
typedef unsigned int    u32;

typedef u16 COLOR;

#define INLINE static inline

// === (from tonc_memmap.h) ===========================================

#define MEM_IO      0x04000000
#define MEM_VRAM    0x06000000
#define GAMEPAK_RAM 0x0E000000

#define REG_DISPCNT     *((volatile u32*)(MEM_IO+0x0000))
#define REG_VCOUNT		*(volatile u16*)(MEM_IO+0x0006)	// vertical count

// === (from tonc_memdef.h) ===========================================

// --- REG_DISPCNT defines ---
#define DCNT_MODE0      0x0000
#define DCNT_MODE1      0x0001
#define DCNT_MODE2      0x0002
#define DCNT_MODE3      0x0003
#define DCNT_MODE4      0x0004
#define DCNT_MODE5      0x0005
// layers
#define DCNT_BG0        0x0100
#define DCNT_BG1        0x0200
#define DCNT_BG2        0x0400
#define DCNT_BG3        0x0800
#define DCNT_OBJ        0x1000

#define save_mem        ((u8*)GAMEPAK_RAM)

// === (from tonc_video.h) ============================================

#define SCREEN_WIDTH   240
#define SCREEN_HEIGHT  160

#define vid_mem  	   ((u16*)MEM_VRAM)

INLINE void m3_plot(int x, int y, COLOR clr)
{   vid_mem[y*SCREEN_WIDTH+x]= clr;    }

#define CLR_BLACK   0x0000
#define CLR_RED     0x001F
#define CLR_LIME    0x03E0
#define CLR_YELLOW  0x03FF
#define CLR_BLUE    0x7C00
#define CLR_MAG     0x7C1F
#define CLR_CYAN    0x7FE0
#define CLR_WHITE   0x7FFF

#define CLR_BLANK	0x8000
#define CLR_ALT		0x8001

INLINE int CLAMP(int val, int min, int max)
{
	if(val >= max)
	{
		val = max - 1;
	}
	else if(val < min)
	{
		val = min;
	}
	else
	{
		return val;
	}
	return val;
}

INLINE COLOR RGB(u32 red, u32 green, u32 blue)
{   return red | (green<<5) | (blue<<10);   }

INLINE u16 * get_RGB(COLOR clr)
{
	u16 red, green, blue;
	red = clr & 31;
	green = (clr >> 5) & 31;
	blue = clr >> 10;
	static u16 rgb[3];
	rgb[0] = red; rgb[1] = green; rgb[2] = blue;
	return rgb;
}

INLINE void vid_vsync()
{
	while(REG_VCOUNT >= 160);   // wait till VDraw
	while(REG_VCOUNT < 160);    // wait till VBlank
}

#endif // TOOLBOX_H