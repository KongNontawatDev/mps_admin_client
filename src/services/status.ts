

export type GenderStatus = "ชาย" | "หญิง" | "ไม่ระบุ" | "" // ชาย , หญิง , ไม่ระบุ
export const genderStatus = (gender: string): {color: string; label: GenderStatus} => {
  if (gender == "ชาย") {
    return {
      color: "#0066ff",
      label: "ชาย",
    }
  } else if (gender == "หญิง") {
    return {
      color: "#ffc0cb",
      label: "หญิง",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}

export type MaterialStatus = "มีอยู่ในสต๊อก" | "หมดสต๊อก" | "" //1 = มีอยู่ในสต๊อก , 2 = หมดสต๊อก
export const materialStatus = (status: number): {color: string; label: MaterialStatus} => {
  if (status == 1) {
    return {
      color: "#28C76F",
      label: "มีอยู่ในสต๊อก",
    }
  } else if (status == 2) {
    return {
      color: "#EC1B2E",
      label: "หมดสต๊อก",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}

export type MaterialPublish = "เปิด" | "ปิด" | "" //1 = เปิด , 2 = ปิด
export const materialPublish = (status: number): {color: string; label: MaterialPublish} => {
  if (status == 1) {
    return {
      color: "#28C76F",
      label: "เปิด",
    }
  } else if (status == 2) {
    return {
      color: "#EC1B2E",
      label: "ปิด",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}

export type WithdrawStatus = "เบิกวัสดุ" | "คืนวัสดุ" | "ผลิต" | "" //1 = เบิกวัสดุ , 2 = คืนวัสดุ, 3=ผลิต
export const withdrawStatus = (status: number): {color: string; label: WithdrawStatus} => {
  if (status == 1) {
    return {
      color: "#f66c26",
      label: "เบิกวัสดุ",
    }
  } else if (status == 2) {
    return {
      color: "#28C76F",
      label: "คืนวัสดุ",
    }
  } else if (status == 3) {
    return {
      color: "#4070F4",
      label: "ผลิต",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}

export type EmployeeStatus = "ทำงานอยู่" | "ไม่ได้ทำงานแล้ว" | "" //1 = ทำงานอยู่ , 2 = ไม่ได้ทำงานแล้ว
export const employeeStatus = (status: number): {color: string; label: EmployeeStatus} => {
  if (status == 1) {
    return {
      color: "#28C76F",
      label: "ทำงานอยู่",
    }
  } else if (status == 2) {
    return {
      color: "#EC1B2E",
      label: "ไม่ได้ทำงานแล้ว",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}

export type AdminLevel = "แอดมิน" | "นักพัฒนา" | "" //1 = แอดมิน , 2 = นักพัฒนา
export const adminLevel = (status: number): {color: string; label: AdminLevel} => {
  if (status == 1) {
    return {
      color: "#1FC4A8",
      label: "แอดมิน",
    }
  } else if (status == 2) {
    return {
      color: "#5542F6",
      label: "นักพัฒนา",
    }
  } else {
    return {
      color: "#F5F5F5",
      label: "",
    }
  }
}
