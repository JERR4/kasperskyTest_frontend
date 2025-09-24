export type ValidationErrors<T> = {
    [K in keyof T]?: string;
};

const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateName(name: string): string | undefined {
    if (name.length < 2 || name.length > 30) {
        return 'Имя должно быть от 2 до 30 символов';
    }

    let isLatin = false;
    let isCyrillic = false;
    for (let i = 0; i < name.length; i++) {
        const char = name[i];

        if (char === ' ') {
            if (i > 0 && name[i - 1] === ' ') {
                return 'В имени не может быть двух пробелов подряд';
            }
            continue;
        }

        const code = char.charCodeAt(0);
        if (((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) && !isCyrillic) {
            isLatin = true;
        }
        else if ((((code >= 1040 && code <= 1103) || code === 1025 || code === 1105)) && !isLatin) {
            isCyrillic = true;
        }
        else {
            return 'Имя должно содержать только буквы одного алфавита и пробелы';
        }
    }

    return undefined;
}

export function validateUser(values: {
    name: string;
    email: string;
    age: number | '';
}) {
    const errors: ValidationErrors<typeof values> = {};

    if (!values.name) {
        errors.name = 'Имя обязательно';
    } else {
        const nameError = validateName(values.name);
        if (nameError) errors.name = nameError;
    }


    if (!values.email.trim()) {
        errors.email = 'Email обязателен';
    } else if (!emailRegex.test(values.email)) {
        errors.email = 'Некорректный email';
    }

    if (values.age === '') {
        errors.age = 'Возраст обязателен';
    } else if (values.age < 18 || values.age > 100) {
        errors.age = 'Возраст должен быть от 18 до 100';
    }

    return errors;
}
