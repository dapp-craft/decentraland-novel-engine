import { Entity, Transform, TransformType, engine } from "@dcl/sdk/ecs"
import { spawnCharacter } from "../../../factory"
import { Character } from "./character"
import ICharacter from "../../parser/interface/i-character"
import { ICharacterTemplate } from "./character-properties"

export interface ICharacterWithParent {
    char: Entity
    parent: Entity
}

export default class CharacterController {
    private _characters: Character[] = []
    constructor(private characterProperties: ICharacterTemplate[]) {
        this._characters.push(
            this.createNewCharacter({
                shortId: 0,
                id: "",
                technicalName: "null",
                displayName: "null",
                asset: "null",
                textSound: undefined
            })
        )
    }
    getCharacters() {
        return this._characters
    }
    getCharacter(shortId: number) {
        return this._characters[shortId]
    }
    getShortId(id: string) {
        return this._characters.findIndex(c => c.charData.id == id)
    }
    getId(shortId: number) {
        return this._characters[shortId].charData.id
    }
    addCharacter(character: ICharacter) {
        if (this._characters.findIndex(c => c.charData.id == character.id) != -1) return
        this._characters.push(this.createNewCharacter(character))
    }
    addCharacters(characters: ICharacter[]) {
        // connect arrays
        for (let i = 0; i < characters.length; i++) {
            this.addCharacter(characters[i])
        }
        this._characters.sort((a, b) => a.charData.shortId - b.charData.shortId)
    }
    createNewCharacter(iChar: ICharacter): Character {
        let prop = this.characterProperties.find(e => e.spawnProps.shortId == iChar.shortId) ?? this.characterProperties[0]
        let p = spawnCharacter(prop.spawnProps.transformArgs, prop.mesh)

        return new Character(iChar, prop.animations, p.char, p.parent)
    }
    giveCharacter(id: number) {
        return this._characters[id]
    }
}
