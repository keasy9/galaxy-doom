import { Scene as PhaserScene } from "phaser";
import { Entity } from "../entities/Entity.ts";

export abstract class Scene extends PhaserScene {
    protected abstract readonly name: string;
    protected entities: Record<string, Entity> = {};
    protected entityGroups: Record<string, Entity[]> = {};

    constructor() {
        super(self.name);
    }

    protected callEntities(method: string, ...args: any[]) {
        for (const [_, entity] of Object.entries(this.entities)) {
            // @ts-ignore
            entity[method](...args);
        }

        for (const [_, entityGroup] of Object.entries(this.entityGroups)) {
            // @ts-ignore
            entityGroup.forEach(entity => entity[method](...args));
        }
    }

    init() {
        this.callEntities('init');
    }

    preload() {
        this.callEntities('preload');
    }

    create() {
        this.callEntities('create');
    }

    update(time: number, delta: number) {
        for (const [key, entity] of Object.entries(this.entities)) {
            if (!entity.isActive()) delete this.entities[key];
        }

        for (const [groupKey, entityGroup] of Object.entries(this.entityGroups)) {
            // @ts-ignore
            entityGroup.forEach((entity, index) => {
                if (!entity.isActive()) delete this.entityGroups[groupKey][index];
            });
        }

        this.callEntities('update', time, delta);
    }

    addEntity(entity: Entity, key: string) {
        this.entities[key] = entity;

        entity.init();
        entity.preload();
        entity.create();
    }

    addEntityToGroup(entity: Entity, groupKey: string) {
        this.entityGroups[groupKey] ??= [];
        this.entityGroups[groupKey].push(entity);

        entity.init();
        entity.preload();
        entity.create();
    }
}