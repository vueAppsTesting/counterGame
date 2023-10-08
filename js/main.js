let { createApp } = Vue;
let { ref, reactive, watch } = Vue;
let app = createApp({
    data() {
        let task = ref("+");
        let leftNumber = ref(1);
        let rightNumber = ref(1);
        let taskText = ref('');
        let taskValue = ref('');
        let showAnsver = ref(false);
        let userClickVariant = ref(0);
        let taskVariantValues = reactive({v: [1,2,3,4,5]});

        function randomInteger(min, max) {
            // случайное число от min до (max+1)
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }          

        function newTask() {
            let left = 0;
            let right = 0;

            // генерируем случайные цифры для левого и правого значения
            function getInteger(n) {
                switch(n) {
                    case 1:
                        return randomInteger(1, 9);
                    case 2:
                        return randomInteger(10, 99);
                    case 3:
                        return randomInteger(100, 999);
                }
            }
            left = getInteger(leftNumber.value);
            right = getInteger(rightNumber.value);

            // генерируем текст задачи
            function getTaskText(l, r, s) {
                return l + ' ' + s + ' ' + r;
            }

            taskText.value = getTaskText(left, right, task.value);

            // считаем решение
            function calculate(l, r, s) {
                switch(s) {
                    case "+":
                        return l * 1 + r * 1;
                    case "-":
                        return l - r;
                    case "*":
                        return l * r;
                    case "/":
                        return l / r;
                }
            }
            taskValue.value = calculate(left, right, task.value); // Правильный ответ на задачу

            // находим близкие по значению варианты
            function getVariant(v) {
                let min = v - randomInteger(2, 10);
                let max = v + randomInteger(2, 10);
                let variants = [];
                for(let i = min; i <= max; i++) {
                    if(i === v) {
                        continue;
                    }
                    variants.push(i);
                }
                return variants;
            }
            
            let variantArray = getVariant(taskValue.value);

            // дстаем из массива 4 уникальных значения
            function getWriteVariant(v) {
                let variants = [];
                for(let i = 0; i < 4; i++) {
                    let n = randomInteger(0, v.length - 1);
                    variants.push(
                        v.splice(n, 1)[0]
                    );
                }
                // вставляем верный ответ
                variants.splice(randomInteger(0, 4), 0 , taskValue.value);
                return variants;
            }
            //console.log(getWriteVariant(variantArray));
            taskVariantValues.v = getWriteVariant(variantArray);
        }

        // генерируем задачу
        newTask();

        // клик по ответу
        function testClick(variant) {
            userClickVariant.value = variant;
            showAnsver.value = true;

        }

        watch(task, () => {
            newTask();
        });
        watch(leftNumber, () => {
            newTask();
        });
        watch(rightNumber, () => {
            newTask();
        });
        return {
            task,
            leftNumber,
            rightNumber,
            taskText,
            taskVariantValues,
            taskValue,
            showAnsver,
            userClickVariant,
            testClick,
            newTask
        }
    }
});
app.mount('#app'); 