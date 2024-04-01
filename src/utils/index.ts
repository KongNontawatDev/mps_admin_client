export function timeAttStatus (status:number):string {
	if(status == 0) {
		return 'รออนุมัติ'
	}else if (status == 1) {
		return 'เข้าตรงเวลา'
	}else if (status == 2) {
		return 'เข้างานสาย'
	}else if (status == 3) {
		return 'ออกตามเวลา'
	}else if (status == 4) {
		return 'ออกก่อนเวลา'
	}else {
		return 'ไม่อนุมัติ'
	}
}

export function timeAttStatusColor (status:number):string {
	if(status == 0) {
		return '#FF9F43'
	}else if (status == 1) {
		return '#28C76F'
	}else if (status == 2) {
		return '#EA5455'
	}else if (status == 3) {
		return '#E8E6FC'
	}else {
		return '#7367F0'
	}
}

export function timeAttShift (shift:number):string {
	if(shift == 1) {
		return 'กะกลางวัน'
	}else if (shift == 2) {
		return 'กะกลางคืน'
	}else {
		return 'ไม่รู้จัก'
	}
}

export function LeaveType (type:number):string {
	if(type == 1) {
		return 'เต็มวัน'
	}else if (type == 2) {
		return 'เป็นชม.'
	}else {
		return 'ไม่รู้จัก'
	}
}

export function convertFontColor(backgroundColor: string): string {
    // Convert the hexadecimal color to RGB
    function hexToRgb(hex: string): number[] {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    // Calculate the brightness of the color
    function calculateBrightness(rgb: number[]): number {
        return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    }

    const rgb = hexToRgb(backgroundColor);
    const brightness = calculateBrightness(rgb);

    // Choose font color based on brightness
    const fontColor = brightness > 0.5 ? '#000000' : '#ffffff';

    return fontColor;
}
