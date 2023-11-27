class Random {
    public static int(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public static shuffleArray<T>(arr: Array<T>) {
        let currenIndex = arr.length, randomIndex;
        while(currenIndex > 0) {
            randomIndex = this.int(0, currenIndex);
            currenIndex--;
            [arr[currenIndex], arr[randomIndex]] = [arr[randomIndex], arr[currenIndex]];
        }
        return arr;
    }
}

export default Random;