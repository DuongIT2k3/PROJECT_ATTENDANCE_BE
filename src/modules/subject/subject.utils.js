import subjectModel from "./subject.model.js";

export const generateSubjectCode = async (englishName) => {
    if(!englishName || typeof englishName !== "string"){
        throw new Error("English name là trường bắt buộc");
    }
    const prefix = englishName.slice(0, 3).toUpperCase();
    
    const lastSubject = await subjectModel.findOne({
        code: { $regex: `^${prefix}\\d{3}$` },
    })
     .sort({code: -1})
     .select("code");

    let nextNumber = 1
    if(lastSubject && lastSubject.code) {
        const lastNumber = parseInt(lastSubject.code.slice(-3), 10);
        nextNumber = lastNumber + 1;
    }

    const formatttedNumber = nextNumber.toString().padStart(3, "0");
    return `${prefix}${formatttedNumber}`;
}