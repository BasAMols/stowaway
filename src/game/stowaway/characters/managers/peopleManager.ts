
import { Character, CharacterType } from "../character";

export class PeopleManager {
    people: Character[] = [];
    public constructor(
        data: CharacterType[] = [],
    ) {
        for (const person of data) {
            this.people.push(new Character(person))
        }
        for (const person of this.people) {
            person.schedule.build();
        }
    }

    getPerson(name: string): Character {
        return this.people.find(person => person.data.name === name);
    }

}