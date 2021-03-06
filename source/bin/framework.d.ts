declare module es {
    /**
     * 执行顺序
     *  - onAddedToEntity
     *  - OnEnabled
     *
     *  删除执行顺序
     *      - onRemovedFromEntity
     */
    abstract class Component {
        /**
         * 此组件附加的实体
         */
        entity: Entity;
        /**
         * 更新该组件的时间间隔。这与实体的更新间隔无关。
         */
        updateInterval: number;
        /**
         * 快速访问 this.entity.transform
         */
        readonly transform: Transform;
        private _enabled;
        /**
         * 如果组件和实体都已启用，则为。当启用该组件时，将调用该组件的生命周期方法。状态的改变会导致调用onEnabled/onDisable。
         */
        /**
        * 如果组件和实体都已启用，则为。当启用该组件时，将调用该组件的生命周期方法。状态的改变会导致调用onEnabled/onDisable。
        * @param value
        */
        enabled: boolean;
        private _updateOrder;
        /** 更新此实体上组件的顺序 */
        /** 更新此实体上组件的顺序 */
        updateOrder: number;
        /**
         * 当此组件已分配其实体，但尚未添加到实体的活动组件列表时调用。有用的东西，如物理组件，需要访问转换来修改碰撞体的属性。
         */
        initialize(): void;
        /**
         * 在提交所有挂起的组件更改后，将该组件添加到场景时调用。此时，设置了实体字段和实体。场景也设定好了。
         */
        onAddedToEntity(): void;
        /**
         * 当此组件从其实体中移除时调用。在这里做所有的清理工作。
         */
        onRemovedFromEntity(): void;
        /**
         * 当实体的位置改变时调用。这允许组件知道它们由于父实体的移动而移动了。
         * @param comp
         */
        onEntityTransformChanged(comp: transform.Component): void;
        /**
         *当父实体或此组件启用时调用
         */
        onEnabled(): void;
        /**
         * 禁用父实体或此组件时调用
         */
        onDisabled(): void;
        setEnabled(isEnabled: boolean): this;
        setUpdateOrder(updateOrder: number): this;
    }
}
declare module es {
    /**
     *  全局核心类
     */
    class Core {
        /**
         * 核心发射器。只发出核心级别的事件
         */
        static emitter: Emitter<CoreEvents>;
        /**
         * 启用/禁用焦点丢失时的暂停。如果为真，则不调用更新或渲染方法
         */
        static pauseOnFocusLost: boolean;
        /**
         * 是否启用调试渲染
         */
        static debugRenderEndabled: boolean;
        /**
         * 简化对内部类的全局内容实例的访问
         */
        static _instance: Core;
        /**
         * 用于确定是否应该使用EntitySystems
         */
        static entitySystemsEnabled: boolean;
        _nextScene: Scene;
        /**
         * 用于凝聚GraphicsDeviceReset事件
         */
        _graphicsDeviceChangeTimer: ITimer;
        /**
         * 全局访问系统
         */
        _globalManagers: FastList<GlobalManager>;
        _timerManager: TimerManager;
        width: number;
        height: number;
        constructor(width: number, height: number, enableEntitySystems?: boolean);
        /**
         * 提供对单例/游戏实例的访问
         * @constructor
         */
        static readonly Instance: Core;
        _frameCounterElapsedTime: number;
        _frameCounter: number;
        _totalMemory: number;
        _titleMemory: (totalMemory: number, frameCounter: number) => void;
        _scene: Scene;
        /**
         * 当前活动的场景。注意，如果设置了该设置，在更新结束之前场景实际上不会改变
         */
        /**
        * 当前活动的场景。注意，如果设置了该设置，在更新结束之前场景实际上不会改变
        * @param value
        */
        static scene: Scene;
        /**
         * 添加一个全局管理器对象，它的更新方法将调用场景前的每一帧。
         * @param manager
         */
        static registerGlobalManager(manager: es.GlobalManager): void;
        /**
         * 删除全局管理器对象
         * @param manager
         */
        static unregisterGlobalManager(manager: es.GlobalManager): void;
        /**
         * 获取类型为T的全局管理器
         * @param type
         */
        static getGlobalManager<T extends es.GlobalManager>(type: any): T;
        /**
         * 调度一个一次性或重复的计时器，该计时器将调用已传递的动作
         * @param timeInSeconds
         * @param repeats
         * @param context
         * @param onTime
         */
        static schedule(timeInSeconds: number, repeats: boolean, context: any, onTime: (timer: ITimer) => void): Timer;
        onOrientationChanged(): void;
        startDebugDraw(): void;
        /**
         * 在一个场景结束后，下一个场景开始之前调用
         */
        onSceneChanged(): void;
        /**
         * 当屏幕大小发生改变时调用
         */
        protected onGraphicsDeviceReset(): void;
        protected initialize(): void;
        protected update(currentTime?: number): Promise<void>;
    }
}
declare module es {
    enum CoreEvents {
        /**
         * 在图形设备重置时触发。当这种情况发生时，任何渲染目标或其他内容的VRAM将被擦除，需要重新生成
         */
        GraphicsDeviceReset = 0,
        /**
         * 当场景发生变化时触发
         */
        SceneChanged = 1,
        /**
         * 当设备方向改变时触发
         */
        OrientationChanged = 2,
        /**
         * 当每帧事件触发时
         */
        FrameUpdated = 3
    }
}
declare module es {
    class EntityComparer implements IComparer<Entity> {
        compare(self: Entity, other: Entity): number;
    }
    class Entity implements IEqualityComparable {
        static _idGenerator: number;
        static entityComparer: IComparer<Entity>;
        /**
         * 当前实体所属的场景
         */
        scene: Scene;
        /**
         * 实体名称。用于在场景范围内搜索实体
         */
        name: string;
        /**
         * 此实体的唯一标识
         */
        readonly id: number;
        /**
         * 封装实体的位置/旋转/缩放，并允许设置一个高层结构
         */
        readonly transform: Transform;
        /**
         * 当前附加到此实体的所有组件的列表
         */
        readonly components: ComponentList;
        /**
         * 指定应该调用这个entity update方法的频率。1表示每一帧，2表示每一帧，以此类推
         */
        updateInterval: number;
        componentBits: BitSet;
        constructor(name: string);
        _isDestroyed: boolean;
        /**
         * 如果调用了destroy，那么在下一次处理实体之前这将一直为true
         */
        readonly isDestroyed: boolean;
        private _tag;
        /**
         * 你可以随意使用。稍后可以使用它来查询场景中具有特定标记的所有实体
         */
        /**
        * 你可以随意使用。稍后可以使用它来查询场景中具有特定标记的所有实体
        * @param value
        */
        tag: number;
        private _enabled;
        /**
         * 启用/禁用实体。当禁用碰撞器从物理系统和组件中移除时，方法将不会被调用
         */
        /**
        * 启用/禁用实体。当禁用碰撞器从物理系统和组件中移除时，方法将不会被调用
        * @param value
        */
        enabled: boolean;
        private _updateOrder;
        /**
         * 更新此实体的顺序。updateOrder还用于对scene.entities上的标签列表进行排序
         */
        /**
        * 更新此实体的顺序。updateOrder还用于对scene.entities上的标签列表进行排序
        * @param value
        */
        updateOrder: number;
        parent: Transform;
        readonly childCount: number;
        position: Vector2;
        localPosition: Vector2;
        rotation: number;
        rotationDegrees: number;
        localRotation: number;
        localRotationDegrees: number;
        scale: Vector2;
        localScale: Vector2;
        readonly worldInverseTransform: Matrix2D;
        readonly localToWorldTransform: Matrix2D;
        readonly worldToLocalTransform: Matrix2D;
        onTransformChanged(comp: transform.Component): void;
        /**
         * 设置实体的标记
         * @param tag
         */
        setTag(tag: number): Entity;
        /**
         * 设置实体的启用状态。当禁用碰撞器从物理系统和组件中移除时，方法将不会被调用
         * @param isEnabled
         */
        setEnabled(isEnabled: boolean): this;
        /**
         * 设置此实体的更新顺序。updateOrder还用于对scene.entities上的标签列表进行排序
         * @param updateOrder
         */
        setUpdateOrder(updateOrder: number): this;
        /**
         * 从场景中删除实体并销毁所有子元素
         */
        destroy(): void;
        /**
         * 将实体从场景中分离。下面的生命周期方法将被调用在组件上:OnRemovedFromEntity
         */
        detachFromScene(): void;
        /**
         * 将一个先前分离的实体附加到一个新的场景
         * @param newScene
         */
        attachToScene(newScene: Scene): void;
        /**
         * 在提交了所有挂起的实体更改后，将此实体添加到场景时调用
         */
        onAddedToScene(): void;
        /**
         * 当此实体从场景中删除时调用
         */
        onRemovedFromScene(): void;
        /**
         * 每帧进行调用进行更新组件
         */
        update(): void;
        /**
         * 将组件添加到组件列表中。返回组件。
         * @param component
         */
        addComponent<T extends Component>(component: T): T;
        /**
         * 获取类型T的第一个组件并返回它。如果没有找到组件，则返回null。
         * @param type
         */
        getComponent<T extends Component>(type: any): T;
        /**
         * 检查实体是否具有该组件
         * @param type
         */
        hasComponent<T extends Component>(type: any): boolean;
        /**
         * 获取类型T的第一个组件并返回它。如果没有找到组件，将创建组件。
         * @param type
         */
        getOrCreateComponent<T extends Component>(type: any): T;
        /**
         * 获取typeName类型的所有组件，但不使用列表分配
         * @param typeName
         * @param componentList
         */
        getComponents(typeName: any, componentList?: any): any;
        /**
         * 从组件列表中删除组件
         * @param component
         */
        removeComponent(component: Component): void;
        /**
         * 从组件列表中删除类型为T的第一个组件
         * @param type
         */
        removeComponentForType<T extends Component>(type: any): boolean;
        /**
         * 从实体中删除所有组件
         */
        removeAllComponents(): void;
        compareTo(other: Entity): number;
        equals(other: Entity): boolean;
        getHashCode(): number;
        toString(): string;
    }
}
declare module es {
    /** 场景 */
    class Scene {
        /**
         * 这个场景中的实体列表
         */
        readonly entities: EntityList;
        /**
         * 管理所有实体处理器
         */
        readonly entityProcessors: EntityProcessorList;
        readonly _sceneComponents: FastList<SceneComponent>;
        _didSceneBegin: any;
        constructor();
        /**
         * 在场景子类中重写这个，然后在这里进行加载。
         * 在场景设置好之后，但在调用begin之前，从contructor中调用这个函数
         */
        initialize(): void;
        /**
         * 当Core将这个场景设置为活动场景时，这个将被调用
         */
        onStart(): void;
        /**
         * 在场景子类中重写这个，并在这里做任何必要的卸载。
         * 当Core把这个场景从活动槽中移除时，这个被调用。
         */
        unload(): void;
        begin(): void;
        end(): void;
        updateResolutionScaler(): void;
        update(): void;
        /**
         * 向组件列表添加并返回SceneComponent
         * @param component
         */
        addSceneComponent<T extends SceneComponent>(component: T): T;
        /**
         * 获取类型为T的第一个SceneComponent并返回它。如果没有找到组件，则返回null。
         * @param type
         */
        getSceneComponent<T extends SceneComponent>(type: any): T;
        /**
         * 获取类型为T的第一个SceneComponent并返回它。如果没有找到SceneComponent，则将创建SceneComponent。
         * @param type
         */
        getOrCreateSceneComponent<T extends SceneComponent>(type: any): T;
        /**
         * 从SceneComponents列表中删除一个SceneComponent
         * @param component
         */
        removeSceneComponent(component: SceneComponent): void;
        /**
         * 将实体添加到此场景，并返回它
         * @param name
         */
        createEntity(name: string): Entity;
        /**
         * 在场景的实体列表中添加一个实体
         * @param entity
         */
        addEntity(entity: Entity): Entity;
        /**
         * 从场景中删除所有实体
         */
        destroyAllEntities(): void;
        /**
         * 搜索并返回第一个具有名称的实体
         * @param name
         */
        findEntity(name: string): Entity;
        /**
         * 返回具有给定标记的所有实体
         * @param tag
         */
        findEntitiesWithTag(tag: number): Entity[];
        /**
         * 返回类型为T的所有实体
         * @param type
         */
        entitiesOfType<T extends Entity>(type: any): T[];
        /**
         * 返回第一个启用加载的类型为T的组件
         * @param type
         */
        findComponentOfType<T extends Component>(type: any): T;
        /**
         * 返回类型为T的所有已启用已加载组件的列表
         * @param type
         */
        findComponentsOfType<T extends Component>(type: any): T[];
        /**
         * 在场景中添加一个EntitySystem处理器
         * @param processor 处理器
         */
        addEntityProcessor(processor: EntitySystem): EntitySystem;
        /**
         * 从场景中删除EntitySystem处理器
         * @param processor
         */
        removeEntityProcessor(processor: EntitySystem): void;
        /**
         * 获取EntitySystem处理器
         */
        getEntityProcessor<T extends EntitySystem>(): T;
    }
}
declare module transform {
    enum Component {
        position = 0,
        scale = 1,
        rotation = 2
    }
}
declare module es {
    enum DirtyType {
        clean = 0,
        positionDirty = 1,
        scaleDirty = 2,
        rotationDirty = 3
    }
    class Transform {
        /** 与此转换关联的实体 */
        readonly entity: Entity;
        hierarchyDirty: DirtyType;
        _localDirty: boolean;
        _localPositionDirty: boolean;
        _localScaleDirty: boolean;
        _localRotationDirty: boolean;
        _positionDirty: boolean;
        _worldToLocalDirty: boolean;
        _worldInverseDirty: boolean;
        /**
         * 值会根据位置、旋转和比例自动重新计算
         */
        _localTransform: Matrix2D;
        /**
         * 值将自动从本地和父矩阵重新计算。
         */
        _worldTransform: Matrix2D;
        _rotationMatrix: Matrix2D;
        _translationMatrix: Matrix2D;
        _scaleMatrix: Matrix2D;
        _children: Transform[];
        constructor(entity: Entity);
        /**
         * 这个转换的所有子元素
         */
        readonly childCount: number;
        /**
         * 变换在世界空间的旋转度
         */
        /**
        * 变换在世界空间的旋转度
        * @param value
        */
        rotationDegrees: number;
        /**
         * 旋转相对于父变换旋转的角度
         */
        /**
        * 旋转相对于父变换旋转的角度
        * @param value
        */
        localRotationDegrees: number;
        readonly localToWorldTransform: Matrix2D;
        _parent: Transform;
        /**
         * 获取此转换的父转换
         */
        /**
        * 设置此转换的父转换
        * @param value
        */
        parent: Transform;
        _worldToLocalTransform: Matrix2D;
        readonly worldToLocalTransform: Matrix2D;
        _worldInverseTransform: Matrix2D;
        readonly worldInverseTransform: Matrix2D;
        _position: Vector2;
        /**
         * 变换在世界空间中的位置
         */
        /**
        * 变换在世界空间中的位置
        * @param value
        */
        position: Vector2;
        _scale: Vector2;
        /**
         * 变换在世界空间的缩放
         */
        /**
        * 变换在世界空间的缩放
        * @param value
        */
        scale: Vector2;
        _rotation: number;
        /**
         * 在世界空间中以弧度旋转的变换
         */
        /**
        * 变换在世界空间的旋转度
        * @param value
        */
        rotation: number;
        _localPosition: Vector2;
        /**
         * 转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
         */
        /**
        * 转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
        * @param value
        */
        localPosition: Vector2;
        _localScale: Vector2;
        /**
         * 转换相对于父元素的比例。如果转换没有父元素，则与transform.scale相同
         */
        /**
        * 转换相对于父元素的比例。如果转换没有父元素，则与transform.scale相同
        * @param value
        */
        localScale: Vector2;
        _localRotation: number;
        /**
         * 相对于父变换的旋转，变换的旋转。如果转换没有父元素，则与transform.rotation相同
         */
        /**
        * 相对于父变换的旋转，变换的旋转。如果转换没有父元素，则与transform.rotation相同
        * @param value
        */
        localRotation: number;
        /**
         * 返回在索引处的转换子元素
         * @param index
         */
        getChild(index: number): Transform;
        /**
         * 设置此转换的父转换
         * @param parent
         */
        setParent(parent: Transform): Transform;
        /**
         * 设置转换在世界空间中的位置
         * @param x
         * @param y
         */
        setPosition(x: number, y: number): Transform;
        /**
         * 设置转换相对于父转换的位置。如果转换没有父元素，则与transform.position相同
         * @param localPosition
         */
        setLocalPosition(localPosition: Vector2): Transform;
        /**
         * 设置变换在世界空间的旋转度
         * @param radians
         */
        setRotation(radians: number): Transform;
        /**
         * 设置变换在世界空间的旋转度
         * @param degrees
         */
        setRotationDegrees(degrees: number): Transform;
        /**
         * 旋转精灵的顶部，使其朝向位置
         * @param pos
         */
        lookAt(pos: Vector2): void;
        /**
         * 相对于父变换的旋转设置变换的旋转。如果转换没有父元素，则与transform.rotation相同
         * @param radians
         */
        setLocalRotation(radians: number): this;
        /**
         * 相对于父变换的旋转设置变换的旋转。如果转换没有父元素，则与transform.rotation相同
         * @param degrees
         */
        setLocalRotationDegrees(degrees: number): Transform;
        /**
         * 设置变换在世界空间中的缩放
         * @param scale
         */
        setScale(scale: Vector2): Transform;
        /**
         * 设置转换相对于父对象的比例。如果转换没有父元素，则与transform.scale相同
         * @param scale
         */
        setLocalScale(scale: Vector2): Transform;
        /**
         * 对精灵坐标进行四舍五入
         */
        roundPosition(): void;
        updateTransform(): void;
        setDirty(dirtyFlagType: DirtyType): void;
        /**
         * 从另一个transform属性进行拷贝
         * @param transform
         */
        copyFrom(transform: Transform): void;
        toString(): string;
    }
}
declare module es {
    class ComponentPool<T extends PooledComponent> {
        private _cache;
        private _type;
        constructor(typeClass: any);
        obtain(): T;
        free(component: T): void;
    }
}
declare module es {
    /**
     * 接口，当添加到一个Component时，只要Component和实体被启用，它就会在每个框架中调用更新方法。
     */
    interface IUpdatable {
        enabled: boolean;
        updateOrder: number;
        update(): any;
    }
    /**
     * 用于比较组件更新排序
     */
    class IUpdatableComparer implements IComparer<IUpdatable> {
        compare(a: IUpdatable, b: IUpdatable): number;
    }
    var isIUpdatable: (props: any) => props is IUpdatable;
}
declare module es {
    /** 回收实例的组件类型。 */
    abstract class PooledComponent extends Component {
        abstract reset(): any;
    }
}
declare module es {
    class SceneComponent implements IComparer<SceneComponent> {
        /**
         * 这个场景组件被附加到的场景
         */
        scene: Scene;
        /**
         * 如果启用了SceneComponent，则为true。状态的改变会导致调用onEnabled/onDisable。
         */
        /**
        * 如果启用了SceneComponent，则为true。状态的改变会导致调用onEnabled/onDisable。
        * @param value
        */
        enabled: boolean;
        /**
         * 更新此场景中SceneComponents的顺序
         */
        updateOrder: number;
        _enabled: boolean;
        /**
         * 在启用此SceneComponent时调用
         */
        onEnabled(): void;
        /**
         * 当禁用此SceneComponent时调用
         */
        onDisabled(): void;
        /**
         * 当该SceneComponent从场景中移除时调用
         */
        onRemovedFromScene(): void;
        /**
         * 在实体更新之前每一帧调用
         */
        update(): void;
        /**
         * 启用/禁用这个SceneComponent
         * @param isEnabled
         */
        setEnabled(isEnabled: boolean): SceneComponent;
        /**
         * 设置SceneComponent的updateOrder并触发某种SceneComponent
         * @param updateOrder
         */
        setUpdateOrder(updateOrder: number): this;
        compare(other: SceneComponent): number;
    }
}
declare module es {
    /**
     * 当添加到组件时，每当实体上的冲突器与另一个组件重叠/退出时，将调用这些方法。
     * ITriggerListener方法将在实现接口的触发器实体上的任何组件上调用。
     * 注意，这个接口只与Mover类一起工作
     */
    interface ITriggerListener {
        /**
         * 当碰撞器与触发碰撞器相交时调用。这是在触发碰撞器和触发碰撞器上调用的。
         * 移动必须由Mover/ProjectileMover方法处理，以使其自动工作。
         * @param other
         * @param local
         */
        onTriggerEnter(other: Collider, local: Collider): any;
        /**
         * 当另一个碰撞器离开触发碰撞器时调用
         * @param other
         * @param local
         */
        onTriggerExit(other: Collider, local: Collider): any;
    }
    class TriggerListenerHelper {
        static getITriggerListener(entity: Entity, components: ITriggerListener[]): ITriggerListener[];
    }
    var isITriggerListener: (props: any) => props is ITriggerListener;
}
declare module es {
    /**
     * 辅助类说明了一种处理移动的方法，它考虑了包括触发器在内的所有冲突。
     * ITriggerListener接口用于管理对移动过程中违反的任何触发器的回调。
     * 一个物体只能通过移动器移动。要正确报告触发器的move方法。
     *
     * 请注意，多个移动者相互交互将多次调用ITriggerListener。
     */
    class Mover extends Component {
        private _triggerHelper;
        onAddedToEntity(): void;
        /**
         * 计算修改运动矢量的运动，以考虑移动时可能发生的碰撞
         * @param motion
         * @param collisionResult
         */
        calculateMovement(motion: Vector2, collisionResult: CollisionResult): boolean;
        /**
         *  将calculatemomovement应用到实体并更新triggerHelper
         * @param motion
         */
        applyMovement(motion: Vector2): void;
        /**
         * 通过调用calculateMovement和applyMovement来移动考虑碰撞的实体;
         * @param motion
         * @param collisionResult
         */
        move(motion: Vector2, collisionResult: CollisionResult): boolean;
    }
}
declare module es {
    /**
     * 只向itriggerlistener报告冲突的移动器
     * 该对象将始终移动完整的距离
     */
    class ProjectileMover extends Component {
        private _tempTriggerList;
        private _collider;
        onAddedToEntity(): void;
        /**
         * 移动考虑碰撞的实体
         * @param motion
         */
        move(motion: Vector2): boolean;
        private notifyTriggerListeners;
    }
}
declare module es {
    abstract class Collider extends Component {
        /**
         * 对撞机的基本形状
         */
        shape: Shape;
        /**
         * 如果这个碰撞器是一个触发器，它将不会引起碰撞，但它仍然会触发事件
         */
        isTrigger: boolean;
        /**
         * 在处理冲突时，physicsLayer可以用作过滤器。Flags类有帮助位掩码的方法
         */
        physicsLayer: Ref<number>;
        /**
         * 碰撞器在使用移动器移动时应该碰撞的层
         * 默认为所有层
         */
        collidesWithLayers: Ref<number>;
        /**
         * 如果为true，碰撞器将根据附加的变换缩放和旋转
         */
        shouldColliderScaleAndRotateWithTransform: boolean;
        /**
         * 这个对撞机在物理系统注册时的边界。
         * 存储这个允许我们始终能够安全地从物理系统中移除对撞机，即使它在试图移除它之前已经被移动了。
         */
        registeredPhysicsBounds: Rectangle;
        _localOffsetLength: number;
        _isPositionDirty: boolean;
        _isRotationDirty: boolean;
        /**
         * 标记来跟踪我们的实体是否被添加到场景中
         */
        protected _isParentEntityAddedToScene: any;
        /**
         * 标记来记录我们是否注册了物理系统
         */
        protected _isColliderRegistered: any;
        /**
         * 镖师碰撞器的绝对位置
         */
        readonly absolutePosition: Vector2;
        /**
         * 封装变换。如果碰撞器没和实体一起旋转 则返回transform.rotation
         */
        readonly rotation: number;
        readonly bounds: Rectangle;
        protected _localOffset: Vector2;
        /**
         * 将localOffset添加到实体。获取碰撞器几何图形的最终位置。
         * 允许向一个实体添加多个碰撞器并分别定位，还允许你设置缩放/旋转
         */
        /**
        * 将localOffset添加到实体。获取碰撞器几何图形的最终位置。
        * 允许向一个实体添加多个碰撞器并分别定位，还允许你设置缩放/旋转
        * @param value
        */
        localOffset: Vector2;
        /**
         * 将localOffset添加到实体。获取碰撞器的最终位置。
         * 这允许您向一个实体添加多个碰撞器并分别定位它们。
         * @param offset
         */
        setLocalOffset(offset: Vector2): Collider;
        /**
         * 如果为true，碰撞器将根据附加的变换缩放和旋转
         * @param shouldColliderScaleAndRotationWithTransform
         */
        setShouldColliderScaleAndRotateWithTransform(shouldColliderScaleAndRotationWithTransform: boolean): Collider;
        onAddedToEntity(): void;
        onRemovedFromEntity(): void;
        onEntityTransformChanged(comp: transform.Component): void;
        onEnabled(): void;
        onDisabled(): void;
        /**
         * 父实体会在不同的时间调用它(当添加到场景，启用，等等)
         */
        registerColliderWithPhysicsSystem(): void;
        /**
         * 父实体会在不同的时候调用它(从场景中移除，禁用，等等)
         */
        unregisterColliderWithPhysicsSystem(): void;
        /**
         * 检查这个形状是否与物理系统中的其他对撞机重叠
         * @param other
         */
        overlaps(other: Collider): boolean;
        /**
         * 检查这个与运动应用的碰撞器(移动向量)是否与碰撞器碰撞。如果是这样，将返回true，并且结果将填充碰撞数据。
         * @param collider
         * @param motion
         * @param result
         */
        collidesWith(collider: Collider, motion: Vector2, result: CollisionResult): boolean;
    }
}
declare module es {
    class BoxCollider extends Collider {
        constructor(x: number, y: number, width: number, height: number);
        width: number;
        height: number;
        /**
         * 设置BoxCollider的大小
         * @param width
         * @param height
         */
        setSize(width: number, height: number): this;
        /**
         * 设置BoxCollider的宽度
         * @param width
         */
        setWidth(width: number): BoxCollider;
        /**
         * 设置BoxCollider的高度
         * @param height
         */
        setHeight(height: number): void;
        toString(): string;
    }
}
declare module es {
    class CircleCollider extends Collider {
        /**
         * 创建一个有半径的圆
         *
         * @param radius
         */
        constructor(radius: number);
        radius: number;
        /**
         * 设置圆的半径
         * @param radius
         */
        setRadius(radius: number): CircleCollider;
        toString(): string;
    }
}
declare module es {
    /**
     * 多边形应该以顺时针方式定义
     */
    class PolygonCollider extends Collider {
        /**
         * 如果这些点没有居中，它们将以localOffset的差异为居中。
         * @param points
         */
        constructor(points: Vector2[]);
    }
}
declare module es {
    class EntitySystem {
        private _entities;
        constructor(matcher?: Matcher);
        private _scene;
        scene: Scene;
        private _matcher;
        readonly matcher: Matcher;
        initialize(): void;
        onChanged(entity: Entity): void;
        add(entity: Entity): void;
        onAdded(entity: Entity): void;
        remove(entity: Entity): void;
        onRemoved(entity: Entity): void;
        update(): void;
        lateUpdate(): void;
        protected begin(): void;
        protected process(entities: Entity[]): void;
        protected lateProcess(entities: Entity[]): void;
        protected end(): void;
    }
}
declare module es {
    /**
     * 基本实体处理系统。将其用作处理具有特定组件的许多实体的基础
     */
    abstract class EntityProcessingSystem extends EntitySystem {
        constructor(matcher: Matcher);
        /**
         * 处理特定的实体
         * @param entity
         */
        abstract processEntity(entity: Entity): any;
        lateProcessEntity(entity: Entity): void;
        /**
         * 遍历这个系统的所有实体并逐个处理它们
         * @param entities
         */
        protected process(entities: Entity[]): void;
        protected lateProcess(entities: Entity[]): void;
    }
}
declare module es {
    abstract class PassiveSystem extends EntitySystem {
        onChanged(entity: Entity): void;
        protected process(entities: Entity[]): void;
    }
}
/** 用于协调其他系统的通用系统基类 */
declare module es {
    abstract class ProcessingSystem extends EntitySystem {
        onChanged(entity: Entity): void;
        /** 处理我们的系统 每帧调用 */
        abstract processSystem(): any;
        protected process(entities: Entity[]): void;
    }
}
declare module es {
    /**
     * 这个类可以从两方面来考虑。你可以把它看成一个位向量或者一组非负整数。这个名字有点误导人。
     *
     * 它是由一个位向量实现的，但同样可以把它看成是一个非负整数的集合;集合中的每个整数由对应索引处的集合位表示。该结构的大小由集合中的最大整数决定。
     */
    class BitSet {
        private static LONG_MASK;
        private _bits;
        constructor(nbits?: number);
        and(bs: BitSet): void;
        andNot(bs: BitSet): void;
        cardinality(): number;
        clear(pos?: number): void;
        get(pos: number): boolean;
        intersects(set: BitSet): boolean;
        isEmpty(): boolean;
        nextSetBit(from: number): number;
        set(pos: number, value?: boolean): void;
        private ensure;
    }
}
declare module es {
    class ComponentList {
        /**
         * 组件列表的全局updateOrder排序
         */
        static compareUpdatableOrder: IUpdatableComparer;
        _entity: Entity;
        /**
         * 添加到实体的组件列表
         */
        _components: FastList<Component>;
        /**
         * 所有需要更新的组件列表
         */
        _updatableComponents: FastList<IUpdatable>;
        /**
         * 添加到此框架的组件列表。用来对组件进行分组，这样我们就可以同时进行加工
         */
        _componentsToAdd: Component[];
        /**
         * 标记要删除此框架的组件列表。用来对组件进行分组，这样我们就可以同时进行加工
         */
        _componentsToRemove: Component[];
        _tempBufferList: Component[];
        /**
         * 用于确定是否需要对该框架中的组件进行排序的标志
         */
        _isComponentListUnsorted: boolean;
        constructor(entity: Entity);
        readonly count: number;
        readonly buffer: Component[];
        markEntityListUnsorted(): void;
        add(component: Component): void;
        remove(component: Component): void;
        /**
         * 立即从组件列表中删除所有组件
         */
        removeAllComponents(): void;
        deregisterAllComponents(): void;
        registerAllComponents(): void;
        /**
         * 处理任何需要删除或添加的组件
         */
        updateLists(): void;
        handleRemove(component: Component): void;
        /**
         * 获取类型T的第一个组件并返回它
         * 可以选择跳过检查未初始化的组件(尚未调用onAddedToEntity方法的组件)
         * 如果没有找到组件，则返回null。
         * @param type
         * @param onlyReturnInitializedComponents
         */
        getComponent<T extends Component>(type: any, onlyReturnInitializedComponents: boolean): T;
        /**
         * 获取T类型的所有组件，但不使用列表分配
         * @param typeName
         * @param components
         */
        getComponents(typeName: any, components?: any): any;
        update(): void;
        onEntityTransformChanged(comp: transform.Component): void;
        onEntityEnabled(): void;
        onEntityDisabled(): void;
    }
}
declare module es {
    class ComponentTypeManager {
        private static _componentTypesMask;
        static add(type: any): void;
        static getIndexFor(type: any): number;
    }
}
declare module es {
    class EntityList {
        scene: Scene;
        /**
         * 场景中添加的实体列表
         */
        _entities: FastList<Entity>;
        /**
         * 本帧添加的实体列表。用于对实体进行分组，以便我们可以同时处理它们
         */
        _entitiesToAdded: HashSet<Entity>;
        /**
         * 本帧被标记为删除的实体列表。用于对实体进行分组，以便我们可以同时处理它们
         */
        _entitiesToRemove: HashSet<Entity>;
        /**
         * 标志，用于确定我们是否需要在这一帧中对实体进行排序
         */
        _isEntityListUnsorted: boolean;
        /**
         * 通过标签跟踪实体，便于检索
         */
        _entityDict: Map<number, Entity[]>;
        _unsortedTags: Set<number>;
        constructor(scene: Scene);
        readonly count: number;
        readonly buffer: FastList<Entity>;
        markEntityListUnsorted(): void;
        markTagUnsorted(tag: number): void;
        /**
         * 将一个实体添加到列表中。所有的生命周期方法将在下一帧中被调用
         * @param entity
         */
        add(entity: Entity): void;
        /**
         * 从列表中删除一个实体。所有的生命周期方法将在下一帧中被调用
         * @param entity
         */
        remove(entity: Entity): void;
        /**
         * 从实体列表中删除所有实体
         */
        removeAllEntities(): void;
        /**
         * 检查实体目前是否由这个EntityList管理
         * @param entity
         */
        contains(entity: Entity): boolean;
        getTagList(tag: number): Entity[];
        addToTagList(entity: Entity): void;
        removeFromTagList(entity: Entity): void;
        update(): void;
        updateLists(): void;
        /**
         * 返回第一个找到的名字为name的实体。如果没有找到则返回null
         * @param name
         */
        findEntity(name: string): Entity;
        /**
         * 返回带有标签的所有实体的列表。如果没有实体有标签，则返回一个空列表。
         * 返回的List可以通过ListPool.free放回池中
         * @param tag
         */
        entitiesWithTag(tag: number): Entity[];
        /**
         * 返回一个T类型的所有实体的列表。
         * 返回的List可以通过ListPool.free放回池中。
         * @param type
         */
        entitiesOfType<T extends Entity>(type: any): T[];
        /**
         * 返回在场景中找到的第一个T类型的组件。
         * @param type
         */
        findComponentOfType<T extends Component>(type: any): T;
        /**
         * 返回在场景中找到的所有T类型的组件。
         * 返回的List可以通过ListPool.free放回池中。
         * @param type
         */
        findComponentsOfType<T extends Component>(type: any): T[];
    }
}
declare module es {
    class EntityProcessorList {
        protected _processors: EntitySystem[];
        add(processor: EntitySystem): void;
        remove(processor: EntitySystem): void;
        onComponentAdded(entity: Entity): void;
        onComponentRemoved(entity: Entity): void;
        onEntityAdded(entity: Entity): void;
        onEntityRemoved(entity: Entity): void;
        begin(): void;
        update(): void;
        lateUpdate(): void;
        end(): void;
        getProcessor<T extends EntitySystem>(): T;
        protected notifyEntityChanged(entity: Entity): void;
        protected removeFromProcessors(entity: Entity): void;
    }
}
declare module es {
    /**
     * 创建这个字典的原因只有一个：
     * 我需要一个能让我直接以数组的形式对值进行迭代的字典，而不需要生成一个数组或使用迭代器。
     * 对于这个目标是比标准字典快N倍。
     * Faster dictionary在大部分操作上也比标准字典快，但差别可以忽略不计。
     * 唯一较慢的操作是在添加时调整内存大小，因为与标准数组相比，这个实现需要使用两个单独的数组。
     */
    class FasterDictionary<TKey, TValue> {
        _values: TValue[];
        _valuesInfo: FastNode[];
        _buckets: number[];
        _freeValueCellIndex: number;
        _collisions: number;
        constructor(size?: number);
        getValuesArray(count: {
            value: number;
        }): TValue[];
        readonly valuesArray: TValue[];
        readonly count: number;
        add(key: TKey, value: TValue): void;
        addValue(key: TKey, value: TValue, indexSet: {
            value: number;
        }): boolean;
        remove(key: TKey): boolean;
        trim(): void;
        clear(): void;
        fastClear(): void;
        containsKey(key: TKey): boolean;
        tryGetValue(key: TKey): TValue;
        tryFindIndex(key: TKey, findIndex: {
            value: number;
        }): boolean;
        getDirectValue(index: number): TValue;
        getIndex(key: TKey): number;
        static updateLinkedList(index: number, valuesInfo: FastNode[]): void;
        static hash(key: any): number;
        static reduce(x: number, n: number): number;
    }
    class FastNode {
        readonly key: any;
        readonly hashcode: number;
        previous: number;
        next: number;
        constructor(key: any, hash: number, previousNode?: number);
    }
}
declare module es {
    /**
     * 围绕一个数组的非常基本的包装，当它达到容量时自动扩展。
     * 注意，在迭代时应该这样直接访问缓冲区，但使用FastList.length字段。
     *
     * @tutorial
     * for( var i = 0; i <= list.length; i++ )
     *      var item = list.buffer[i];
     */
    class FastList<T> {
        /**
         * 直接访问后备缓冲区。
         * 不要使用buffer.Length! 使用FastList.length
         */
        buffer: T[];
        /**
         * 直接访问缓冲区内填充项的长度。不要改变。
         */
        length: number;
        constructor(size?: number);
        /**
         * 清空列表并清空缓冲区中的所有项目
         */
        clear(): void;
        /**
         *  和clear的工作原理一样，只是它不会将缓冲区中的所有项目清空。
         */
        reset(): void;
        /**
         * 将该项目添加到列表中
         * @param item
         */
        add(item: T): void;
        /**
         * 从列表中删除该项目
         * @param item
         */
        remove(item: T): void;
        /**
         * 从列表中删除给定索引的项目。
         * @param index
         */
        removeAt(index: number): void;
        /**
         * 检查项目是否在FastList中
         * @param item
         */
        contains(item: T): boolean;
        /**
         * 如果缓冲区达到最大，将分配更多的空间来容纳额外的ItemCount。
         * @param additionalItemCount
         */
        ensureCapacity(additionalItemCount?: number): void;
        /**
         * 添加数组中的所有项目
         * @param array
         */
        addRange(array: T[]): void;
        /**
         * 对缓冲区中的所有项目进行排序，长度不限。
         */
        sort(comparer: IComparer<T>): void;
    }
}
declare module es {
    class HashHelpers {
        static readonly hashCollisionThreshold: number;
        static readonly hashPrime: number;
        /**
         * 用来作为哈希表大小的质数表。
         * 一个典型的调整大小的算法会在这个数组中选取比之前容量大两倍的最小质数。
         * 假设我们的Hashtable当前的容量为x，并且添加了足够多的元素，因此需要进行大小调整。
         * 调整大小首先计算2x，然后在表中找到第一个大于2x的质数，即如果质数的顺序是p_1，p_2，...，p_i，...，则找到p_n，使p_n-1 < 2x < p_n。
         * 双倍对于保持哈希特操作的渐近复杂度是很重要的，比如添加。
         * 拥有一个质数可以保证双倍哈希不会导致无限循环。 IE，你的哈希函数将是h1(key)+i*h2(key)，0 <= i < size.h2和size必须是相对质数。
         */
        static readonly primes: number[];
        /**
         * 这是比Array.MaxArrayLength小的最大质数
         */
        static readonly maxPrimeArrayLength: number;
        static isPrime(candidate: number): boolean;
        static getPrime(min: number): number;
        /**
         *
         * @param oldSize
         * @returns 返回要增长的哈希特表的大小
         */
        static expandPrime(oldSize: number): number;
        static getHashCode(str: any): number;
    }
}
declare module es {
    class Matcher {
        protected allSet: BitSet;
        protected exclusionSet: BitSet;
        protected oneSet: BitSet;
        static empty(): Matcher;
        getAllSet(): BitSet;
        getExclusionSet(): BitSet;
        getOneSet(): BitSet;
        isInterestedEntity(e: Entity): boolean;
        isInterested(componentBits: BitSet): boolean;
        all(...types: any[]): Matcher;
        exclude(...types: any[]): this;
        one(...types: any[]): this;
    }
}
declare class StringUtils {
    /**
     * 特殊符号字符串
     */
    private static specialSigns;
    /**
     * 匹配中文字符
     * @param    str    需要匹配的字符串
     * @return
     */
    static matchChineseWord(str: string): string[];
    /**
     * 去除字符串左端的空白字符
     * @param    target        目标字符串
     * @return
     */
    static lTrim(target: string): string;
    /**
     * 去除字符串右端的空白字符
     * @param    target        目标字符串
     * @return
     */
    static rTrim(target: string): string;
    /**
     * 返回一个去除2段空白字符的字符串
     * @param    target
     * @return  返回一个去除2段空白字符的字符串
     */
    static trim(target: string): string;
    /**
     * 返回该字符是否为空白字符
     * @param    str
     * @return  返回该字符是否为空白字符
     */
    static isWhiteSpace(str: string): boolean;
    /**
     * 返回执行替换后的字符串
     * @param    mainStr   待查找字符串
     * @param    targetStr 目标字符串
     * @param    replaceStr 替换字符串
     * @param    caseMark  是否忽略大小写
     * @return  返回执行替换后的字符串
     */
    static replaceMatch(mainStr: string, targetStr: string, replaceStr: string, caseMark?: boolean): string;
    /**
     * 用html实体换掉字符窜中的特殊字符
     * @param    str                需要替换的字符串
     * @param    reversion        是否翻转替换：将转义符号替换为正常的符号
     * @return    换掉特殊字符后的字符串
     */
    static htmlSpecialChars(str: string, reversion?: boolean): string;
    /**
     * 给数字字符前面添 "0"
     *
     * <pre>
     *
     * trace( StringFormat.zfill('1') );
     * // 01
     *
     * trace( StringFormat.zfill('16', 5) );
     * // 00016
     *
     * trace( StringFormat.zfill('-3', 3) );
     * // -03
     *
     * </pre>
     *
     * @param str 要进行处理的字符串
     * @param width 处理后字符串的长度，
     *              如果str.length >= width，将不做任何处理直接返回原始的str。
     * @return
     *
     */
    static zfill(str: string, width?: number): string;
    /**
     * 翻转字符串
     * @param    str 字符串
     * @return  翻转后的字符串
     */
    static reverse(str: string): string;
    /**
     * 截断某段字符串
     * @param    str        目标字符串
     * @param    start    需要截断的起始索引
     * @param    len        截断长度
     * @param    order    顺序，true从字符串头部开始计算，false从字符串尾巴开始结算。
     * @return    截断后的字符串
     */
    static cutOff(str: string, start: number, len: number, order?: boolean): string;
    /**{0} 字符替换   */
    static strReplace(str: string, rStr: string[]): string;
}
declare module es {
    /** 提供帧定时信息 */
    class Time {
        /** 游戏运行的总时间 */
        static totalTime: number;
        /** deltaTime的未缩放版本。不受时间尺度的影响 */
        static unscaledDeltaTime: any;
        /** 前一帧到当前帧的时间增量，按时间刻度进行缩放 */
        static deltaTime: number;
        /** 时间刻度缩放 */
        static timeScale: number;
        /** 已传递的帧总数 */
        static frameCount: number;
        /** 自场景加载以来的总时间 */
        static timeSinceSceneLoad: any;
        private static _lastTime;
        static update(currentTime: number): void;
        static sceneChanged(): void;
        /**
         * 允许在间隔检查。只应该使用高于delta的间隔值，否则它将始终返回true。
         * @param interval
         */
        static checkEvery(interval: number): boolean;
    }
}
declare class TimeUtils {
    /**
     * 计算月份ID
     * @param d 指定计算日期
     * @returns 月ID
     */
    static monthId(d?: Date): number;
    /**
     * 计算日期ID
     * @param d 指定计算日期
     * @returns 日期ID
     */
    static dateId(t?: Date): number;
    /**
     * 计算周ID
     * @param d 指定计算日期
     * @returns 周ID
     */
    static weekId(d?: Date, first?: boolean): number;
    /**
     * 计算俩日期时间差，如果a比b小，返回负数
     */
    static diffDay(a: Date, b: Date, fixOne?: boolean): number;
    /**
     * 获取本周一 凌晨时间
     */
    static getFirstDayOfWeek(d?: Date): Date;
    /**
     * 获取当日凌晨时间
     */
    static getFirstOfDay(d?: Date): Date;
    /**
     * 获取次日凌晨时间
     */
    static getNextFirstOfDay(d?: Date): Date;
    /**
     * @returns 2018-12-12
     */
    static formatDate(date: Date): string;
    /**
     * @returns 2018-12-12 12:12:12
     */
    static formatDateTime(date: Date): string;
    /**
     * @returns s 2018-12-12 或者 2018-12-12 12:12:12
     */
    static parseDate(s: string): Date;
    /**
     * 秒数转换为时间形式。
     * @param    time 秒数
     * @param    partition 分隔符
     * @param    showHour  是否显示小时
     * @return  返回一个以分隔符分割的时, 分, 秒
     *
     * 比如: time = 4351; secondToTime(time)返回字符串01:12:31;
     */
    static secondToTime(time?: number, partition?: string, showHour?: boolean): string;
    /**
     * 时间形式转换为毫秒数。
     * @param   time  以指定分隔符分割的时间字符串
     * @param   partition  分隔符
     * @return  毫秒数显示的字符串
     * @throws  Error Exception
     *
     * 用法1 trace(MillisecondTransform.timeToMillisecond("00:60:00"))
     * 输出   3600000
     *
     *
     * 用法2 trace(MillisecondTransform.timeToMillisecond("00.60.00","."))
     * 输出   3600000
     */
    static timeToMillisecond(time: string, partition?: string): string;
}
declare module es {
    /** 贝塞尔帮助类 */
    class Bezier {
        /**
         * 二次贝塞尔曲线
         * @param p0
         * @param p1
         * @param p2
         * @param t
         */
        static getPoint(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2;
        /**
         * 得到二次贝塞尔函数的一阶导数
         * @param p0
         * @param p1
         * @param p2
         * @param t
         */
        static getFirstDerivative(p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2;
        /**
         * 得到一个三次贝塞尔函数的一阶导数
         * @param start
         * @param firstControlPoint
         * @param secondControlPoint
         * @param end
         * @param t
         */
        static getFirstDerivativeThree(start: Vector2, firstControlPoint: Vector2, secondControlPoint: Vector2, end: Vector2, t: number): Vector2;
        /**
         * 计算一个三次贝塞尔
         * @param start
         * @param firstControlPoint
         * @param secondControlPoint
         * @param end
         * @param t
         */
        static getPointThree(start: Vector2, firstControlPoint: Vector2, secondControlPoint: Vector2, end: Vector2, t: number): Vector2;
        /**
         * 递归地细分bezier曲线，直到满足距离校正
         * 在这种算法中，平面切片的点要比曲面切片少。返回完成后应返回到ListPool的合并列表。
         * @param start
         * @param firstCtrlPoint
         * @param secondCtrlPoint
         * @param end
         * @param distanceTolerance
         */
        static getOptimizedDrawingPoints(start: Vector2, firstCtrlPoint: Vector2, secondCtrlPoint: Vector2, end: Vector2, distanceTolerance?: number): Vector2[];
        /**
         * 递归地细分bezier曲线，直到满足距离校正。在这种算法中，平面切片的点要比曲面切片少。
         * @param start
         * @param firstCtrlPoint
         * @param secondCtrlPoint
         * @param end
         * @param points
         * @param distanceTolerance
         */
        private static recursiveGetOptimizedDrawingPoints;
    }
}
declare module es {
    /**
     * 帮助处理位掩码的实用程序类
     * 除了isFlagSet之外，所有方法都期望flag参数是一个非移位的标志
     * 允许您使用普通的(0、1、2、3等)来设置/取消您的标记
     */
    class Flags {
        /**
         * 检查位标志是否已在数值中设置
         * 检查期望标志是否已经移位
         * @param self
         * @param flag
         */
        static isFlagSet(self: number, flag: number): boolean;
        /**
         * 检查位标志是否在数值中设置
         * @param self
         * @param flag
         */
        static isUnshiftedFlagSet(self: number, flag: number): boolean;
        /**
         *  设置数值标志位，移除所有已经设置的标志
         * @param self
         * @param flag
         */
        static setFlagExclusive(self: Ref<number>, flag: number): void;
        /**
         * 设置标志位
         * @param self
         * @param flag
         */
        static setFlag(self: Ref<number>, flag: number): void;
        /**
         * 取消标志位
         * @param self
         * @param flag
         */
        static unsetFlag(self: Ref<number>, flag: number): void;
        /**
         * 反转数值集合位
         * @param self
         */
        static invertFlags(self: Ref<number>): void;
    }
}
declare module es {
    class MathHelper {
        static readonly Epsilon: number;
        static readonly Rad2Deg: number;
        static readonly Deg2Rad: number;
        /**
         * 表示pi除以2的值(1.57079637)
         */
        static readonly PiOver2: number;
        /**
         * 将弧度转换成角度。
         * @param radians 用弧度表示的角
         */
        static toDegrees(radians: number): number;
        /**
         * 将角度转换为弧度
         * @param degrees
         */
        static toRadians(degrees: number): number;
        /**
         * mapps值(在leftMin - leftMax范围内)到rightMin - rightMax范围内的值
         * @param value
         * @param leftMin
         * @param leftMax
         * @param rightMin
         * @param rightMax
         */
        static map(value: number, leftMin: number, leftMax: number, rightMin: number, rightMax: number): number;
        static lerp(value1: number, value2: number, amount: number): number;
        static clamp(value: number, min: number, max: number): number;
        /**
         * 给定圆心、半径和角度，得到圆周上的一个点。0度是3点钟。
         * @param circleCenter
         * @param radius
         * @param angleInDegrees
         */
        static pointOnCirlce(circleCenter: Vector2, radius: number, angleInDegrees: number): Vector2;
        /**
         * 如果值为偶数，返回true
         * @param value
         */
        static isEven(value: number): boolean;
        /**
         * 数值限定在0-1之间
         * @param value
         */
        static clamp01(value: number): number;
        static angleBetweenVectors(from: Vector2, to: Vector2): number;
        /**
         * 增加t并确保它总是大于或等于0并且小于长度
         * @param t
         * @param length
         */
        static incrementWithWrap(t: number, length: number): number;
        /**
         * 由上移量向上移。start可以小于或大于end。例如:开始是2，结束是10，移位是4，结果是6
         * @param start
         * @param end
         * @param shift
         */
        static approach(start: number, end: number, shift: number): number;
    }
}
declare module es {
    /**
     * 表示右手3 * 3的浮点矩阵，可以存储平移、缩放和旋转信息。
     */
    class Matrix2D implements IEquatable<Matrix2D> {
        m11: number;
        m12: number;
        m21: number;
        m22: number;
        m31: number;
        m32: number;
        /**
         * 返回标识矩阵
         */
        static readonly identity: Matrix2D;
        /**
         * 储存在该矩阵中的位置
         */
        translation: Vector2;
        /**
         * 以弧度为单位的旋转，存储在这个矩阵中
         */
        rotation: number;
        /**
         * 矩阵中存储的旋转度数
         */
        rotationDegrees: number;
        /**
         * 储存在这个矩阵中的缩放
         */
        scale: Vector2;
        /**
         * 构建一个矩阵
         * @param m11
         * @param m12
         * @param m21
         * @param m22
         * @param m31
         * @param m32
         */
        constructor(m11: number, m12: number, m21: number, m22: number, m31: number, m32: number);
        /**
         * 创建一个新的围绕Z轴的旋转矩阵2D
         * @param radians
         */
        static createRotation(radians: number): Matrix2D;
        /**
         * 创建一个新的缩放矩阵2D
         * @param xScale
         * @param yScale
         */
        static createScale(xScale: number, yScale: number): Matrix2D;
        /**
         * 创建一个新的平移矩阵2D
         * @param xPosition
         * @param yPosition
         */
        static createTranslation(xPosition: number, yPosition: number): Matrix2D;
        static invert(matrix: Matrix2D): Matrix2D;
        /**
         * 创建一个新的matrix, 它包含两个矩阵的和。
         * @param matrix
         */
        add(matrix: Matrix2D): Matrix2D;
        substract(matrix: Matrix2D): Matrix2D;
        divide(matrix: Matrix2D): Matrix2D;
        multiply(matrix: Matrix2D): Matrix2D;
        determinant(): number;
        /**
         * 创建一个新的Matrix2D，包含指定矩阵中的线性插值。
         * @param matrix1
         * @param matrix2
         * @param amount
         */
        static lerp(matrix1: Matrix2D, matrix2: Matrix2D, amount: number): Matrix2D;
        /**
         * 交换矩阵的行和列
         * @param matrix
         */
        static transpose(matrix: Matrix2D): Matrix2D;
        mutiplyTranslation(x: number, y: number): Matrix2D;
        /**
         * 比较当前实例是否等于指定的Matrix2D
         * @param other
         */
        equals(other: Matrix2D): boolean;
        toString(): string;
    }
}
declare module es {
    class MatrixHelper {
        /**
         * 创建一个新的Matrix2D，其中包含两个矩阵的和
         * @param matrix1
         * @param matrix2
         */
        static add(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D;
        /**
         * 将一个Matrix2D的元素除以另一个矩阵的元素
         * @param matrix1
         * @param matrix2
         */
        static divide(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D;
        /**
         * 创建一个新的Matrix2D，包含两个矩阵的乘法
         * @param matrix1
         * @param matrix2
         */
        static mutiply(matrix1: Matrix2D, matrix2: Matrix2D | number): Matrix2D;
        /**
         * 创建一个新的Matrix2D，包含一个矩阵与另一个矩阵的减法。
         * @param matrix1
         * @param matrix2
         */
        static subtract(matrix1: Matrix2D, matrix2: Matrix2D): Matrix2D;
    }
}
declare module es {
    class Rectangle implements IEquatable<Rectangle> {
        /**
         * 该矩形的左上角的x坐标
         */
        x: number;
        /**
         * 该矩形的左上角的y坐标
         */
        y: number;
        /**
         * 该矩形的宽度
         */
        width: number;
        /**
         * 该矩形的高度
         */
        height: number;
        /**
         * 返回X=0, Y=0, Width=0, Height=0的矩形
         */
        static readonly empty: Rectangle;
        /**
         * 返回一个Number.Min/Max值的矩形
         */
        static readonly maxRect: Rectangle;
        /**
         * 返回此矩形左边缘的X坐标
         */
        readonly left: number;
        /**
         * 返回此矩形右边缘的X坐标
         */
        readonly right: number;
        /**
         * 返回此矩形顶边的y坐标
         */
        readonly top: number;
        /**
         * 返回此矩形底边的y坐标
         */
        readonly bottom: number;
        /**
         * 获取矩形的最大点，即右下角
         */
        readonly max: Vector2;
        /**
         * 这个矩形的宽和高是否为0，位置是否为（0，0）
         */
        isEmpty(): boolean;
        /** 这个矩形的左上角坐标 */
        location: Vector2;
        /**
         * 这个矩形的宽-高坐标
         */
        size: Vector2;
        /**
         * 位于这个矩形中心的一个点
         * 如果 "宽度 "或 "高度 "是奇数，则中心点将向下舍入
         */
        readonly center: Vector2;
        _tempMat: Matrix2D;
        _transformMat: Matrix2D;
        /**
         * 创建一个新的Rectanglestruct实例，指定位置、宽度和高度。
         * @param x 创建的矩形的左上角的X坐标
         * @param y 创建的矩形的左上角的y坐标
         * @param width 创建的矩形的宽度
         * @param height 创建的矩形的高度
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
         * 创建一个给定最小/最大点（左上角，右下角）的矩形
         * @param minX
         * @param minY
         * @param maxX
         * @param maxY
         */
        static fromMinMax(minX: number, minY: number, maxX: number, maxY: number): Rectangle;
        /**
         * 给定多边形的点，计算边界
         * @param points
         * @returns 来自多边形的点
         */
        static rectEncompassingPoints(points: Vector2[]): Rectangle;
        /**
         * 获取指定边缘的位置
         * @param edge
         */
        getSide(edge: Edge): number;
        /**
         * 获取所提供的坐标是否在这个矩形的范围内
         * @param x 检查封堵点的X坐标
         * @param y 检查封堵点的Y坐标
         */
        contains(x: number, y: number): boolean;
        /**
         * 按指定的水平和垂直方向调整此矩形的边缘
         * @param horizontalAmount 调整左、右边缘的值
         * @param verticalAmount 调整上、下边缘的值
         */
        inflate(horizontalAmount: number, verticalAmount: number): void;
        /**
         * 获取其他矩形是否与这个矩形相交
         * @param value 另一个用于测试的矩形
         */
        intersects(value: Rectangle): boolean;
        rayIntersects(ray: Ray2D, distance: Ref<number>): boolean;
        /**
         * 获取所提供的矩形是否在此矩形的边界内
         * @param value
         */
        containsRect(value: Rectangle): boolean;
        getHalfSize(): Vector2;
        getClosestPointOnBoundsToOrigin(): Vector2;
        /**
         * 返回离给定点最近的点
         * @param point 矩形上离点最近的点
         */
        getClosestPointOnRectangleToPoint(point: Vector2): Vector2;
        /**
         * 获取矩形边界上与给定点最近的点
         * @param point
         * @param edgeNormal
         * @returns 矩形边框上离点最近的点
         */
        getClosestPointOnRectangleBorderToPoint(point: Vector2, edgeNormal: Vector2): Vector2;
        /**
         * 创建一个新的RectangleF，该RectangleF包含两个其他矩形的重叠区域
         * @param value1
         * @param value2
         * @returns 将两个矩形的重叠区域作为输出参数
         */
        static intersect(value1: Rectangle, value2: Rectangle): Rectangle;
        /**
         * 改变这个矩形的位置
         * @param offsetX 要添加到这个矩形的X坐标
         * @param offsetY 要添加到这个矩形的y坐标
         */
        offset(offsetX: number, offsetY: number): void;
        /**
         * 创建一个完全包含两个其他矩形的新矩形
         * @param value1
         * @param value2
         */
        static union(value1: Rectangle, value2: Rectangle): Rectangle;
        /**
         * 在矩形重叠的地方创建一个新的矩形
         * @param value1
         * @param value2
         */
        static overlap(value1: Rectangle, value2: Rectangle): Rectangle;
        calculateBounds(parentPosition: Vector2, position: Vector2, origin: Vector2, scale: Vector2, rotation: number, width: number, height: number): void;
        /**
         * 返回一个横跨当前矩形和提供的三角形位置的矩形
         * @param deltaX
         * @param deltaY
         */
        getSweptBroadphaseBounds(deltaX: number, deltaY: number): Rectangle;
        /**
         * 如果发生碰撞，返回true
         * moveX和moveY将返回b1为避免碰撞而必须移动的移动量
         * @param other
         * @param moveX
         * @param moveY
         */
        collisionCheck(other: Rectangle, moveX: Ref<number>, moveY: Ref<number>): boolean;
        /**
         * 计算两个矩形之间有符号的交点深度
         * @param rectA
         * @param rectB
         * @returns 两个相交的矩形之间的重叠量。
         * 这些深度值可以是负值，取决于矩形/相交的哪些边。
         * 这允许调用者确定正确的推送对象的方向，以解决碰撞问题。
         * 如果矩形不相交，则返回Vector2.Zero
         */
        static getIntersectionDepth(rectA: Rectangle, rectB: Rectangle): Vector2;
        /**
         * 比较当前实例是否等于指定的矩形
         * @param other
         */
        equals(other: Rectangle): boolean;
        /**
         * 获取这个矩形的哈希码
         */
        getHashCode(): number;
        clone(): Rectangle;
    }
}
declare module es {
    /**
     * 它存储值，直到累计的总数大于1。一旦超过1，该值将在调用update时添加到amount中
     * 一般用法如下:
     *
     *  let deltaMove = this.velocity * es.Time.deltaTime;
     *  deltaMove.x = this._x.update(deltaMove.x);
     *  deltaMove.y = this._y.update(deltaMove.y);
     */
    class SubpixelFloat {
        remainder: number;
        /**
         * 以amount递增余数，将值截断，存储新的余数并将amount设置为当前值
         * @param amount
         */
        update(amount: number): number;
        /**
         * 将余数重置为0
         */
        reset(): void;
    }
}
declare module es {
    class SubpixelVector2 {
        _x: SubpixelFloat;
        _y: SubpixelFloat;
        /**
         * 以数量递增s/y余数，将值截断为整数，存储新的余数并将amount设置为当前值
         * @param amount
         */
        update(amount: Vector2): void;
        /**
         * 将余数重置为0
         */
        reset(): void;
    }
}
declare module es {
    /** 2d 向量 */
    class Vector2 implements IEquatable<Vector2> {
        x: number;
        y: number;
        /**
         * 从两个值构造一个带有X和Y的二维向量。
         * @param x 二维空间中的x坐标
         * @param y 二维空间的y坐标
         */
        constructor(x?: number, y?: number);
        static readonly zero: Vector2;
        static readonly one: Vector2;
        static readonly unitX: Vector2;
        static readonly unitY: Vector2;
        /**
         *
         * @param value1
         * @param value2
         */
        static add(value1: Vector2, value2: Vector2): Vector2;
        /**
         *
         * @param value1
         * @param value2
         */
        static divide(value1: Vector2, value2: Vector2): Vector2;
        /**
         *
         * @param value1
         * @param value2
         */
        static multiply(value1: Vector2, value2: Vector2): Vector2;
        /**
         *
         * @param value1
         * @param value2
         */
        static subtract(value1: Vector2, value2: Vector2): Vector2;
        /**
         * 创建一个新的Vector2
         * 它包含来自另一个向量的标准化值。
         * @param value
         */
        static normalize(value: Vector2): Vector2;
        /**
         * 返回两个向量的点积
         * @param value1
         * @param value2
         */
        static dot(value1: Vector2, value2: Vector2): number;
        /**
         * 返回两个向量之间距离的平方
         * @param value1
         * @param value2
         */
        static distanceSquared(value1: Vector2, value2: Vector2): number;
        /**
         * 将指定的值限制在一个范围内
         * @param value1
         * @param min
         * @param max
         */
        static clamp(value1: Vector2, min: Vector2, max: Vector2): Vector2;
        /**
         * 创建一个新的Vector2，其中包含指定向量的线性插值
         * @param value1 第一个向量
         * @param value2 第二个向量
         * @param amount 加权值(0.0-1.0之间)
         * @returns 指定向量的线性插值结果
         */
        static lerp(value1: Vector2, value2: Vector2, amount: number): Vector2;
        /**
         * 创建一个新的Vector2，该Vector2包含了通过指定的Matrix进行的二维向量变换。
         * @param position
         * @param matrix
         */
        static transform(position: Vector2, matrix: Matrix2D): Vector2;
        /**
         * 返回两个向量之间的距离
         * @param value1
         * @param value2
         * @returns 两个向量之间的距离
         */
        static distance(value1: Vector2, value2: Vector2): number;
        /**
         * 返回两个向量之间的角度，单位是度数
         * @param from
         * @param to
         */
        static angle(from: Vector2, to: Vector2): number;
        /**
         * 创建一个包含指定向量反转的新Vector2
         * @param value
         * @returns 矢量反演的结果
         */
        static negate(value: Vector2): Vector2;
        /**
         *
         * @param value
         */
        add(value: Vector2): Vector2;
        /**
         *
         * @param value
         */
        divide(value: Vector2): Vector2;
        /**
         *
         * @param value
         */
        multiply(value: Vector2): Vector2;
        /**
         * 从当前Vector2减去一个Vector2
         * @param value 要减去的Vector2
         * @returns 当前Vector2
         */
        subtract(value: Vector2): this;
        /**
         * 将这个Vector2变成一个方向相同的单位向量
         */
        normalize(): void;
        /** 返回它的长度 */
        length(): number;
        /**
         * 返回该Vector2的平方长度
         * @returns 这个Vector2的平方长度
         */
        lengthSquared(): number;
        /**
         * 四舍五入X和Y值
         */
        round(): Vector2;
        /**
         * 比较当前实例是否等于指定的对象
         * @param other 要比较的对象
         * @returns 如果实例相同true 否则false
         */
        equals(other: Vector2 | object): boolean;
        clone(): Vector2;
    }
}
declare module es {
    /**
     * 移动器使用的帮助器类，用于管理触发器碰撞器交互并调用itriggerlistener
     */
    class ColliderTriggerHelper {
        private _entity;
        /** 存储当前帧中发生的所有活动交点对 */
        private _activeTriggerIntersections;
        /** 存储前一帧的交点对，这样我们就可以在移动这一帧后检测到退出 */
        private _previousTriggerIntersections;
        private _tempTriggerList;
        constructor(entity: Entity);
        /**
         * update应该在实体被移动后被调用，它将处理任何与Colllider重叠的ITriggerListeners。
         * 它将处理任何与Collider重叠的ITriggerListeners。
         */
        update(): void;
        private checkForExitedColliders;
        private notifyTriggerListeners;
    }
}
declare module es {
    enum PointSectors {
        center = 0,
        top = 1,
        bottom = 2,
        topLeft = 9,
        topRight = 5,
        left = 8,
        right = 4,
        bottomLeft = 10,
        bottomRight = 6
    }
    class Collisions {
        static isLineToLine(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2): boolean;
        static lineToLineIntersection(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2): Vector2;
        static closestPointOnLine(lineA: Vector2, lineB: Vector2, closestTo: Vector2): Vector2;
        static circleToCircle(circleCenter1: Vector2, circleRadius1: number, circleCenter2: Vector2, circleRadius2: number): boolean;
        static circleToLine(circleCenter: Vector2, radius: number, lineFrom: Vector2, lineTo: Vector2): boolean;
        static circleToPoint(circleCenter: Vector2, radius: number, point: Vector2): boolean;
        static rectToCircle(rect: Rectangle, cPosition: Vector2, cRadius: number): boolean;
        static rectToLine(rect: Rectangle, lineFrom: Vector2, lineTo: Vector2): boolean;
        static rectToPoint(rX: number, rY: number, rW: number, rH: number, point: Vector2): boolean;
        /**
         * 位标志和帮助使用Cohen–Sutherland算法
         *
         * 位标志:
         * 1001 1000 1010
         * 0001 0000 0010
         * 0101 0100 0110
         * @param rX
         * @param rY
         * @param rW
         * @param rH
         * @param point
         */
        static getSector(rX: number, rY: number, rW: number, rH: number, point: Vector2): PointSectors;
    }
}
declare module es {
    class RaycastHit {
        /**
         * 对撞机被射线击中
         */
        collider: Collider;
        /**
         * 撞击发生时沿射线的距离。
         */
        fraction: number;
        /**
         * 从射线原点到碰撞点的距离
         */
        distance: number;
        /**
         * 世界空间中光线击中对撞机表面的点
         */
        point: Vector2;
        /**
         * 被射线击中的表面的法向量
         */
        normal: Vector2;
        /**
         * 用于执行转换的质心。使其接触的形状的位置。
         */
        centroid: Vector2;
        constructor(collider?: Collider, fraction?: number, distance?: number, point?: Vector2, normal?: Vector2);
        setValues(collider: Collider, fraction: number, distance: number, point: Vector2): void;
        setValuesNonCollider(fraction: number, distance: number, point: Vector2, normal: Vector2): void;
        reset(): void;
        toString(): string;
    }
}
declare module es {
    class Physics {
        static _spatialHash: SpatialHash;
        /** 调用reset并创建一个新的SpatialHash时使用的单元格大小 */
        static spatialHashCellSize: number;
        /** 接受layerMask的所有方法的默认值 */
        static readonly allLayers: number;
        /**
         * raycast是否检测配置为触发器的碰撞器
         */
        static raycastsHitTriggers: boolean;
        /**
         * 在碰撞器中开始的射线/直线是否强制转换检测到那些碰撞器
         */
        static raycastsStartInColliders: boolean;
        /**
         * 我们保留它以避免在每次raycast发生时分配它
         */
        static _hitArray: RaycastHit[];
        static reset(): void;
        /**
         * 从SpatialHash中移除所有碰撞器
         */
        static clear(): void;
        /**
         * 获取位于指定圆内的所有碰撞器
         * @param center
         * @param randius
         * @param results
         * @param layerMask
         */
        static overlapCircleAll(center: Vector2, randius: number, results: any[], layerMask?: number): number;
        /**
         * 返回所有碰撞器与边界相交的碰撞器。bounds。请注意，这是一个broadphase检查，所以它只检查边界，不做单个碰撞到碰撞器的检查!
         * @param rect
         * @param layerMask
         */
        static boxcastBroadphase(rect: Rectangle, layerMask?: number): Set<Collider>;
        /**
         * 返回所有与边界相交的碰撞器，不包括传入的碰撞器(self)。如果您希望为其他查询自行创建扫过的边界，则此方法非常有用
         * @param collider
         * @param rect
         * @param layerMask
         */
        static boxcastBroadphaseExcludingSelf(collider: Collider, rect: Rectangle, layerMask?: number): Set<Collider>;
        /**
         * 将对撞机添加到物理系统中
         * @param collider
         */
        static addCollider(collider: Collider): void;
        /**
         * 从物理系统中移除对撞机
         * @param collider
         */
        static removeCollider(collider: Collider): void;
        /**
         * 更新物理系统中对撞机的位置。这实际上只是移除然后重新添加带有新边界的碰撞器
         * @param collider
         */
        static updateCollider(collider: Collider): void;
        /**
         * 返回与layerMask匹配的碰撞器的第一次命中
         * @param start
         * @param end
         * @param layerMask
         */
        static linecast(start: Vector2, end: Vector2, layerMask?: number): RaycastHit;
        /**
         * 通过空间散列强制执行一行，并用该行命中的任何碰撞器填充hits数组
         * @param start
         * @param end
         * @param hits
         * @param layerMask
         */
        static linecastAll(start: Vector2, end: Vector2, hits: RaycastHit[], layerMask?: number): number;
    }
}
declare module es {
    /**
     * 不是真正的射线(射线只有开始和方向)，作为一条线和射线。
     */
    class Ray2D {
        start: Vector2;
        end: Vector2;
        direction: Vector2;
        constructor(position: Vector2, end: Vector2);
    }
}
declare module es {
    class SpatialHash {
        gridBounds: Rectangle;
        _raycastParser: RaycastResultParser;
        /**
         * 散列中每个单元格的大小
         */
        _cellSize: number;
        /**
         * 1除以单元格大小。缓存结果，因为它被大量使用。
         */
        _inverseCellSize: number;
        /**
         * 缓存的循环用于重叠检查
         */
        _overlapTestCircle: Circle;
        /**
         * 保存所有数据的字典
         */
        _cellDict: NumberDictionary;
        /**
         * 用于返回冲突信息的共享HashSet
         */
        _tempHashSet: Set<Collider>;
        constructor(cellSize?: number);
        /**
         * 将对象添加到SpatialHash
         * @param collider
         */
        register(collider: Collider): void;
        /**
         * 从SpatialHash中删除对象
         * @param collider
         */
        remove(collider: Collider): void;
        /**
         * 使用蛮力方法从SpatialHash中删除对象
         * @param obj
         */
        removeWithBruteForce(obj: Collider): void;
        clear(): void;
        /**
         * 返回边框与单元格相交的所有对象
         * @param bounds
         * @param excludeCollider
         * @param layerMask
         */
        aabbBroadphase(bounds: Rectangle, excludeCollider: Collider, layerMask: number): Set<Collider>;
        /**
         * 通过空间散列强制执行一行，并用该行命中的任何碰撞器填充hits数组。
         * @param start
         * @param end
         * @param hits
         * @param layerMask
         */
        linecast(start: Vector2, end: Vector2, hits: RaycastHit[], layerMask: number): number;
        /**
         * 获取位于指定圆内的所有碰撞器
         * @param circleCenter
         * @param radius
         * @param results
         * @param layerMask
         */
        overlapCircle(circleCenter: Vector2, radius: number, results: Collider[], layerMask: any): number;
        /**
         * 获取单元格的x,y值作为世界空间的x,y值
         * @param x
         * @param y
         */
        cellCoords(x: number, y: number): Vector2;
        /**
         * 获取世界空间x,y值的单元格。
         * 如果单元格为空且createCellIfEmpty为true，则会创建一个新的单元格
         * @param x
         * @param y
         * @param createCellIfEmpty
         */
        cellAtPosition(x: number, y: number, createCellIfEmpty?: boolean): Collider[];
    }
    /**
     * 包装一个Unit32，列表碰撞器字典
     * 它的主要目的是将int、int x、y坐标散列到单个Uint32键中，使用O(1)查找。
     */
    class NumberDictionary {
        _store: Map<string, Collider[]>;
        add(x: number, y: number, list: Collider[]): void;
        /**
         * 使用蛮力方法从字典存储列表中移除碰撞器
         * @param obj
         */
        remove(obj: Collider): void;
        tryGetValue(x: number, y: number): Collider[];
        getKey(x: number, y: number): string;
        /**
         * 清除字典数据
         */
        clear(): void;
    }
    class RaycastResultParser {
        hitCounter: number;
        static compareRaycastHits: (a: RaycastHit, b: RaycastHit) => number;
        _hits: RaycastHit[];
        _tempHit: RaycastHit;
        _checkedColliders: Collider[];
        _cellHits: RaycastHit[];
        _ray: Ray2D;
        _layerMask: number;
        start(ray: Ray2D, hits: RaycastHit[], layerMask: number): void;
        /**
         * 如果hits数组被填充，返回true。单元格不能为空!
         * @param cellX
         * @param cellY
         * @param cell
         */
        checkRayIntersection(cellX: number, cellY: number, cell: Collider[]): boolean;
        reset(): void;
    }
}
declare module es {
    abstract class Shape {
        /**
         * 有一个单独的位置字段可以让我们改变形状的位置来进行碰撞检查，而不是改变entity.position。
         * 触发碰撞器/边界/散列更新的位置。
         * 内部字段
         */
        position: Vector2;
        /**
         * 这不是中心。这个值不一定是物体的中心。对撞机更准确。
         * 应用任何转换旋转的localOffset
         * 内部字段
         */
        center: Vector2;
        /** 缓存的形状边界 内部字段 */
        bounds: Rectangle;
        abstract recalculateBounds(collider: Collider): any;
        abstract overlaps(other: Shape): boolean;
        abstract collidesWithShape(other: Shape, collisionResult: CollisionResult): boolean;
        abstract collidesWithLine(start: Vector2, end: Vector2, hit: RaycastHit): boolean;
        abstract containsPoint(point: Vector2): any;
        abstract pointCollidesWithShape(point: Vector2, result: CollisionResult): boolean;
    }
}
declare module es {
    /**
     * 多边形
     */
    class Polygon extends Shape {
        /**
         * 组成多边形的点
         * 保持顺时针与凸边形
         */
        points: Vector2[];
        _areEdgeNormalsDirty: boolean;
        /**
         * 多边形的原始数据
         */
        _originalPoints: Vector2[];
        _polygonCenter: Vector2;
        /**
         * 用于优化未旋转box碰撞
         */
        isBox: boolean;
        isUnrotated: boolean;
        /**
         * 从点构造一个多边形
         * 多边形应该以顺时针方式指定 不能重复第一个/最后一个点，它们以0 0为中心
         * @param points
         * @param isBox
         */
        constructor(points: Vector2[], isBox?: boolean);
        _edgeNormals: Vector2[];
        /**
         * 边缘法线用于SAT碰撞检测。缓存它们用于避免squareRoots
         * box只有两个边缘 因为其他两边是平行的
         */
        readonly edgeNormals: Vector2[];
        /**
         * 重置点并重新计算中心和边缘法线
         * @param points
         */
        setPoints(points: Vector2[]): void;
        /**
         * 重新计算多边形中心
         * 如果点数改变必须调用该方法
         */
        recalculateCenterAndEdgeNormals(): void;
        /**
         * 建立多边形边缘法线
         * 它们仅由edgeNormals getter惰性创建和更新
         */
        buildEdgeNormals(): void;
        /**
         * 建立一个对称的多边形(六边形，八角形，n角形)并返回点
         * @param vertCount
         * @param radius
         */
        static buildSymmetricalPolygon(vertCount: number, radius: number): any[];
        /**
         * 重定位多边形的点
         * @param points
         */
        static recenterPolygonVerts(points: Vector2[]): void;
        /**
         * 找到多边形的中心。注意，这对于正则多边形是准确的。不规则多边形没有中心。
         * @param points
         */
        static findPolygonCenter(points: Vector2[]): Vector2;
        /**
         * 不知道辅助顶点，所以取每个顶点，如果你知道辅助顶点，执行climbing算法
         * @param points
         * @param direction
         */
        static getFarthestPointInDirection(points: Vector2[], direction: Vector2): Vector2;
        /**
         * 迭代多边形的所有边，并得到任意边上离点最近的点。
         * 通过最近点的平方距离和它所在的边的法线返回。
         * 点应该在多边形的空间中(点-多边形.位置)
         * @param points
         * @param point
         * @param distanceSquared
         * @param edgeNormal
         */
        static getClosestPointOnPolygonToPoint(points: Vector2[], point: Vector2, distanceSquared: Ref<number>, edgeNormal: Vector2): Vector2;
        /**
         * 旋转原始点并复制旋转的值到旋转的点
         * @param radians
         * @param originalPoints
         * @param rotatedPoints
         */
        static rotatePolygonVerts(radians: number, originalPoints: Vector2[], rotatedPoints: Vector2[]): void;
        recalculateBounds(collider: Collider): void;
        overlaps(other: Shape): any;
        collidesWithShape(other: Shape, result: CollisionResult): boolean;
        collidesWithLine(start: es.Vector2, end: es.Vector2, hit: es.RaycastHit): boolean;
        /**
         * 本质上，这个算法所做的就是从一个点发射一条射线。
         * 如果它与奇数条多边形边相交，我们就知道它在多边形内部。
         * @param point
         */
        containsPoint(point: Vector2): boolean;
        pointCollidesWithShape(point: Vector2, result: CollisionResult): boolean;
    }
}
declare module es {
    /**
     * 多边形的特殊情况。在进行SAT碰撞检查时，我们只需要检查2个轴而不是8个轴
     */
    class Box extends Polygon {
        width: number;
        height: number;
        constructor(width: number, height: number);
        /**
         * 在一个盒子的形状中建立多边形需要的点的帮助方法
         * @param width
         * @param height
         */
        private static buildBox;
        /**
         * 更新框点，重新计算中心，设置宽度/高度
         * @param width
         * @param height
         */
        updateBox(width: number, height: number): void;
        overlaps(other: Shape): any;
        collidesWithShape(other: Shape, result: CollisionResult): boolean;
        containsPoint(point: Vector2): boolean;
        pointCollidesWithShape(point: es.Vector2, result: es.CollisionResult): boolean;
    }
}
declare module es {
    class Circle extends Shape {
        radius: number;
        _originalRadius: number;
        constructor(radius: number);
        recalculateBounds(collider: es.Collider): void;
        overlaps(other: Shape): any;
        collidesWithShape(other: Shape, result: CollisionResult): boolean;
        collidesWithLine(start: es.Vector2, end: es.Vector2, hit: es.RaycastHit): boolean;
        /**
         * 获取所提供的点是否在此范围内
         * @param point
         */
        containsPoint(point: es.Vector2): boolean;
        pointCollidesWithShape(point: Vector2, result: CollisionResult): boolean;
    }
}
declare module es {
    class CollisionResult {
        /**
         * 与之相撞的对撞机
         */
        collider: Collider;
        /**
         * 被形状击中的表面的法向量
         */
        normal: Vector2;
        /**
         * 应用于第一个形状以推入形状的转换
         */
        minimumTranslationVector: Vector2;
        /**
         * 不是所有冲突类型都使用!在依赖这个字段之前，请检查ShapeCollisions切割类!
         */
        point: Vector2;
        /**
         * 改变最小平移向量，如果没有相同方向上的运动，它将移除平移的x分量。
         * @param deltaMovement
         */
        removeHorizontal(deltaMovement: Vector2): void;
        invertResult(): this;
        toString(): string;
    }
}
declare module es {
    class RealtimeCollisions {
        static intersectMovingCircleBox(s: Circle, b: Box, movement: Vector2, time: Ref<number>): boolean;
    }
}
declare module es {
    /**
     * 各种形状的碰撞例程
     * 大多数人都希望第一个形状位于第二个形状的空间内(即shape1)
     * pos应该设置为shape1。pos - shape2.pos)。
     */
    class ShapeCollisions {
        /**
         * 检查两个多边形之间的碰撞
         * @param first
         * @param second
         * @param result
         */
        static polygonToPolygon(first: Polygon, second: Polygon, result: CollisionResult): boolean;
        /**
         * 计算[minA, maxA]和[minB, maxB]之间的距离。如果间隔重叠，距离是负的
         * @param minA
         * @param maxA
         * @param minB
         * @param maxB
         */
        static intervalDistance(minA: number, maxA: number, minB: number, maxB: any): number;
        /**
         * 计算一个多边形在一个轴上的投影，并返回一个[min，max]区间
         * @param axis
         * @param polygon
         * @param min
         * @param max
         */
        static getInterval(axis: Vector2, polygon: Polygon, min: Ref<number>, max: Ref<number>): void;
        /**
         *
         * @param circle
         * @param polygon
         * @param result
         */
        static circleToPolygon(circle: Circle, polygon: Polygon, result: CollisionResult): boolean;
        /**
         * 适用于圆心在方框内以及只与方框外圆心重叠的圆。
         * @param circle
         * @param box
         * @param result
         */
        static circleToBox(circle: Circle, box: Box, result: CollisionResult): boolean;
        /**
         *
         * @param point
         * @param circle
         * @param result
         */
        static pointToCircle(point: Vector2, circle: Circle, result: CollisionResult): boolean;
        static pointToBox(point: Vector2, box: Box, result: CollisionResult): boolean;
        /**
         *
         * @param lineA
         * @param lineB
         * @param closestTo
         */
        static closestPointOnLine(lineA: Vector2, lineB: Vector2, closestTo: Vector2): Vector2;
        /**
         *
         * @param point
         * @param poly
         * @param result
         */
        static pointToPoly(point: Vector2, poly: Polygon, result: CollisionResult): boolean;
        /**
         *
         * @param first
         * @param second
         * @param result
         */
        static circleToCircle(first: Circle, second: Circle, result: CollisionResult): boolean;
        /**
         *
         * @param first
         * @param second
         * @param result
         */
        static boxToBox(first: Box, second: Box, result: CollisionResult): boolean;
        private static minkowskiDifference;
        static lineToPoly(start: Vector2, end: Vector2, polygon: Polygon, hit: RaycastHit): boolean;
        static lineToLine(a1: Vector2, a2: Vector2, b1: Vector2, b2: Vector2, intersection: Vector2): boolean;
        static lineToCircle(start: Vector2, end: Vector2, s: Circle, hit: RaycastHit): boolean;
        /**
         * 用second检查被deltaMovement移动的框的结果
         * @param first
         * @param second
         * @param movement
         * @param hit
         */
        static boxToBoxCast(first: Box, second: Box, movement: Vector2, hit: RaycastHit): boolean;
    }
}
declare class ArrayUtils {
    /**
     * 执行冒泡排序
     * @param    ary
     * 算法参考 -- http://www.hiahia.org/datastructure/paixu/paixu8.3.1.1-1.htm
     */
    static bubbleSort(ary: number[]): void;
    /**
     * 执行插入排序
     * @param ary
     */
    static insertionSort(ary: number[]): void;
    /**
     * 执行二分搜索
     * @param ary 搜索的数组（必须排序过）
     * @param value 需要搜索的值
     * @returns 返回匹配结果的数组索引
     */
    static binarySearch(ary: number[], value: number): number;
    /**
     * 返回匹配项的索引
     * @param ary
     * @param num
     */
    static findElementIndex(ary: any[], num: any): any;
    /**
     * 返回数组中最大值的索引
     * @param ary
     */
    static getMaxElementIndex(ary: number[]): number;
    /**
     * 返回数组中最小值的索引
     * @param ary
     */
    static getMinElementIndex(ary: number[]): number;
    /**
     * 返回一个"唯一性"数组
     * @param ary 需要唯一性的数组
     * @returns 唯一性的数组
     *
     * @tutorial
     * 比如: [1, 2, 2, 3, 4]
     * 返回: [1, 2, 3, 4]
     */
    static getUniqueAry(ary: number[]): number[];
    /**
     * 返回2个数组中不同的部分
     * 比如数组A = [1, 2, 3, 4, 6]
     *    数组B = [0, 2, 1, 3, 4]
     * 返回[6, 0]
     * @param    aryA
     * @param    aryB
     * @return
     */
    static getDifferAry(aryA: number[], aryB: number[]): number[];
    /**
     * 交换数组元素
     * @param    array    目标数组
     * @param    index1    交换后的索引
     * @param    index2    交换前的索引
     */
    static swap(array: any[], index1: number, index2: number): void;
    /**
     * 清除列表
     * @param ary
     */
    static clearList(ary: any[]): void;
    /**
     * 克隆一个数组
     * @param    ary 需要克隆的数组
     * @return  克隆的数组
     */
    static cloneList(ary: any[]): any[];
    /**
     * 判断2个数组是否相同
     * @param ary1 数组1
     * @param ary2 数组2
     */
    static equals(ary1: number[], ary2: number[]): Boolean;
    /**
     * 根据索引插入元素，索引和索引后的元素都向后移动一位
     * @param ary
     * @param index 插入索引
     * @param value 插入的元素
     * @returns 插入的元素 未插入则返回空
     */
    static insert(ary: any[], index: number, value: any): any;
    /**
     * 打乱数组 Fisher–Yates shuffle
     * @param list
     */
    static shuffle<T>(list: T[]): void;
    /**
     * 如果项目已经在列表中，返回false，如果成功添加，返回true
     * @param list
     * @param item
     */
    static addIfNotPresent<T>(list: T[], item: T): boolean;
    /**
     * 返回列表中的最后一项。列表中至少应该有一个项目
     * @param list
     */
    static lastItem<T>(list: T[]): T;
    /**
     * 从列表中随机获取一个项目。不清空检查列表!
     * @param list
     */
    static randomItem<T>(list: T[]): T;
    /**
     * 从列表中随机获取物品。不清空检查列表，也不验证列表数是否大于项目数。返回的List可以通过ListPool.free放回池中
     * @param list
     * @param itemCount 从列表中返回的随机项目的数量
     */
    static randomItems<T>(list: T[], itemCount: number): T[];
}
declare module es {
    class Base64Utils {
        private static _keyStr;
        /**
         * 判断是否原生支持Base64位解析
         */
        static readonly nativeBase64: boolean;
        /**
         * 解码
         * @param input
         */
        static decode(input: string): string;
        /**
         * 编码
         * @param input
         */
        static encode(input: string): string;
        /**
         * 解析Base64格式数据
         * @param input
         * @param bytes
         */
        static decodeBase64AsArray(input: string, bytes: number): Uint32Array;
        /**
         * 暂时不支持
         * @param data
         * @param decoded
         * @param compression
         * @private
         */
        static decompress(data: string, decoded: any, compression: string): any;
        /**
         * 解析csv数据
         * @param input
         */
        static decodeCSV(input: string): Array<number>;
    }
}
declare module es {
    class Color {
        /**
         * 存储为RGBA
         */
        private _packedValue;
        /**
         * 从代表红、绿、蓝和alpha值的标量构造RGBA颜色。
         */
        constructor(r: number, g: number, b: number, alpha: number);
        b: number;
        g: number;
        r: number;
        a: number;
        packedValue: number;
        equals(other: Color): boolean;
    }
}
declare module es {
    class EdgeExt {
        static oppositeEdge(self: Edge): Edge;
        /**
         * 如果边是右或左，则返回true
         * @param self
         */
        static isHorizontal(self: Edge): boolean;
        /**
         * 如果边是顶部或底部，则返回true
         * @param self
         */
        static isVertical(self: Edge): boolean;
    }
}
declare module es {
    /**
     * 用于包装事件的一个小类
     */
    class FuncPack {
        /** 函数 */
        func: Function;
        /** 上下文 */
        context: any;
        constructor(func: Function, context: any);
    }
    /**
     * 用于事件管理
     */
    class Emitter<T> {
        private _messageTable;
        constructor();
        /**
         * 开始监听项
         * @param eventType 监听类型
         * @param handler 监听函数
         * @param context 监听上下文
         */
        addObserver(eventType: T, handler: Function, context: any): void;
        /**
         * 移除监听项
         * @param eventType 事件类型
         * @param handler 事件函数
         */
        removeObserver(eventType: T, handler: Function): void;
        /**
         * 触发该事件
         * @param eventType 事件类型
         * @param data 事件数据
         */
        emit(eventType: T, data?: any): void;
    }
}
declare module es {
    enum Edge {
        top = 0,
        bottom = 1,
        left = 2,
        right = 3
    }
}
declare module es {
    class Enumerable {
        /**
         * 生成包含一个重复值的序列
         * @param element 要重复的值
         * @param count 在生成的序列中重复该值的次数
         */
        static repeat<T>(element: T, count: number): any[];
    }
}
declare module es {
    class EqualityComparer<T> implements IEqualityComparer<T> {
        static default<T>(): EqualityComparer<T>;
        protected constructor();
        equals(x: T, y: T): boolean;
        getHashCode(o: T): number;
        private _getHashCodeForNumber;
        private _getHashCodeForString;
        private forOwn;
    }
}
declare module es {
    class GlobalManager {
        _enabled: boolean;
        /**
         * 如果true则启用了GlobalManager。
         * 状态的改变会导致调用OnEnabled/OnDisable
         */
        /**
        * 如果true则启用了GlobalManager。
        * 状态的改变会导致调用OnEnabled/OnDisable
        * @param value
        */
        enabled: boolean;
        /**
         * 启用/禁用这个GlobalManager
         * @param isEnabled
         */
        setEnabled(isEnabled: boolean): void;
        /**
         * 此GlobalManager启用时调用
         */
        onEnabled(): void;
        /**
         * 此GlobalManager禁用时调用
         */
        onDisabled(): void;
        /**
         * 在frame .update之前调用每一帧
         */
        update(): void;
    }
}
declare module es {
    interface IComparer<T> {
        compare(x: T, y: T): number;
    }
}
declare module es {
    /**
     * 对象声明自己的平等方法和Hashcode的生成
     */
    interface IEqualityComparable {
        /**
         * 确定另一个对象是否等于这个实例
         * @param other
         */
        equals(other: any): boolean;
        /**
         * 生成对象的哈希码
         */
        getHashCode(): number;
    }
}
declare module es {
    /**
     * 为确定对象的哈希码和两个项目是否相等提供接口
     */
    interface IEqualityComparer<T> {
        /**
         * 判断两个对象是否相等
         * @param x
         * @param y
         */
        equals(x: T, y: T): boolean;
        /**
         * 生成对象的哈希码
         * @param value
         */
        getHashCode(value: T): number;
    }
}
declare module es {
    /**
     * 实现该接口用于判定两个对象是否相等的快速接口
     */
    interface IEquatable<T> {
        equals(other: T): boolean;
    }
}
declare module es {
    /**
     * 可以用于列表池的简单类
     */
    class ListPool {
        private static readonly _objectQueue;
        /**
         * 预热缓存，使用最大的cacheCount对象填充缓存
         * @param cacheCount
         */
        static warmCache(cacheCount: number): void;
        /**
         * 将缓存修剪为cacheCount项目
         * @param cacheCount
         */
        static trimCache(cacheCount: any): void;
        /**
         * 清除缓存
         */
        static clearCache(): void;
        /**
         * 如果可以的话，从堆栈中弹出一个项
         */
        static obtain<T>(): T[];
        /**
         * 将项推回堆栈
         * @param obj
         */
        static free<T>(obj: Array<T>): void;
    }
}
declare module es {
    class NumberExtension {
        static toNumber(value: any): number;
    }
}
declare module es {
    /**
     * 用于管理一对对象的简单DTO
     */
    class Pair<T> implements IEqualityComparable {
        first: T;
        second: T;
        constructor(first: T, second: T);
        clear(): void;
        equals(other: Pair<T>): boolean;
        getHashCode(): number;
    }
}
declare module es {
    /**
     * 用于池任何对象
     */
    class Pool<T> {
        private static _objectQueue;
        /**
         * 预热缓存，使用最大的cacheCount对象填充缓存
         * @param type
         * @param cacheCount
         */
        static warmCache(type: any, cacheCount: number): void;
        /**
         * 将缓存修剪为cacheCount项目
         * @param cacheCount
         */
        static trimCache(cacheCount: number): void;
        /**
         * 清除缓存
         */
        static clearCache(): void;
        /**
         * 如果可以的话，从堆栈中弹出一个项
         */
        static obtain<T>(type: any): T;
        /**
         * 将项推回堆栈
         * @param obj
         */
        static free<T>(obj: T): void;
    }
    interface IPoolable {
        /**
         * 重置对象以供重用。对象引用应该为空，字段可以设置为默认值
         */
        reset(): any;
    }
    var isIPoolable: (props: any) => props is IPoolable;
}
declare class RandomUtils {
    /**
     * 在 start 与 stop之间取一个随机整数，可以用step指定间隔， 但不包括较大的端点（start与stop较大的一个）
     * 如
     * this.randrange(1, 10, 3)
     * 则返回的可能是   1 或  4 或  7  , 注意 这里面不会返回10，因为是10是大端点
     *
     * @param start
     * @param stop
     * @param step
     * @return 假设 start < stop,  [start, stop) 区间内的随机整数
     *
     */
    static randrange(start: number, stop: number, step?: number): number;
    /**
     * 返回a 到 b直间的随机整数，包括 a 和 b
     * @param a
     * @param b
     * @return [a, b] 直接的随机整数
     *
     */
    static randint(a: number, b: number): number;
    /**
     * 返回 a - b之间的随机数，不包括  Math.max(a, b)
     * @param a
     * @param b
     * @return 假设 a < b, [a, b)
     */
    static randnum(a: number, b: number): number;
    /**
     * 打乱数组
     * @param array
     * @return
     */
    static shuffle(array: any[]): any[];
    /**
     * 从序列中随机取一个元素
     * @param sequence 可以是 数组、 vector，等只要是有length属性，并且可以用数字索引获取元素的对象，
     *                 另外，字符串也是允许的。
     * @return 序列中的某一个元素
     *
     */
    static choice(sequence: any): any;
    /**
     * 对列表中的元素进行随机采æ ?
     * <pre>
     * this.sample([1, 2, 3, 4, 5],  3)  // Choose 3 elements
     * [4, 1, 5]
     * </pre>
     * @param sequence
     * @param num
     * @return
     *
     */
    static sample(sequence: any[], num: number): any[];
    /**
     * 返回 0.0 - 1.0 之间的随机数，等同于 Math.random()
     * @return Math.random()
     *
     */
    static random(): number;
    /**
     * 计算概率
     * @param    chance 概率
     * @return
     */
    static boolean(chance?: number): boolean;
    private static _randomCompare;
}
declare module es {
    class RectangleExt {
        /**
         * 获取指定边的位置
         * @param rect
         * @param edge
         */
        static getSide(rect: Rectangle, edge: Edge): number;
        /**
         * 计算两个矩形的并集。结果将是一个包含其他两个的矩形。
         * @param first
         * @param point
         */
        static union(first: Rectangle, point: Vector2): Rectangle;
        static getHalfRect(rect: Rectangle, edge: Edge): Rectangle;
        /**
         * 获取矩形的一部分，其宽度/高度的大小位于矩形的边缘，但仍然包含在其中。
         * @param rect
         * @param edge
         * @param size
         */
        static getRectEdgePortion(rect: Rectangle, edge: Edge, size?: number): Rectangle;
        static expandSide(rect: Rectangle, edge: Edge, amount: number): void;
        static contract(rect: Rectangle, horizontalAmount: any, verticalAmount: any): void;
    }
}
declare module es {
    /**
     * 使得number/string/boolean类型作为对象引用来进行传递
     */
    class Ref<T extends number | string | boolean> {
        value: T;
        constructor(value: T);
    }
}
declare module es {
    interface ISet<T> {
        add(item: T): boolean;
        remove(item: T): boolean;
        contains(item: T): boolean;
        getCount(): number;
        clear(): void;
        toArray(): Array<T>;
        /**
         * 从当前集合中删除指定集合中的所有元素
         * @param other
         */
        exceptWith(other: Array<T>): void;
        /**
         * 修改当前Set对象，使其只包含该对象和指定数组中的元素
         * @param other
         */
        intersectWith(other: Array<T>): void;
        /**
         * 修改当前的集合对象，使其包含所有存在于自身、指定集合中的元素，或者两者都包含
         * @param other
         */
        unionWith(other: Array<T>): void;
        isSubsetOf(other: Array<T>): boolean;
        isSupersetOf(other: Array<T>): boolean;
        overlaps(other: Array<T>): boolean;
        setEquals(other: Array<T>): boolean;
    }
    abstract class Set<T> implements ISet<T> {
        protected buckets: T[][];
        protected count: number;
        constructor(source?: Array<T>);
        abstract getHashCode(item: T): number;
        abstract areEqual(value1: T, value2: T): boolean;
        add(item: T): boolean;
        remove(item: T): boolean;
        contains(item: T): boolean;
        getCount(): number;
        clear(): void;
        toArray(): T[];
        /**
         * 从当前集合中删除指定集合中的所有元素
         * @param other
         */
        exceptWith(other: Array<T>): void;
        /**
         * 修改当前Set对象，使其只包含该对象和指定数组中的元素
         * @param other
         */
        intersectWith(other: Array<T>): void;
        unionWith(other: Array<T>): void;
        /**
         * 确定当前集合是否为指定集合或数组的子集
         * @param other
         */
        isSubsetOf(other: Array<T>): boolean;
        /**
         * 确定当前不可变排序集是否为指定集合的超集
         * @param other
         */
        isSupersetOf(other: Array<T>): boolean;
        overlaps(other: Array<T>): boolean;
        setEquals(other: Array<T>): boolean;
        private buildInternalBuckets;
        private bucketsContains;
    }
    class HashSet<T extends IEqualityComparable> extends Set<T> {
        constructor(source?: Array<T>);
        getHashCode(item: T): number;
        areEqual(value1: T, value2: T): boolean;
    }
}
declare module es {
    /**
     * 管理数值的简单助手类。它存储值，直到累计的总数大于1。一旦超过1，该值将在调用update时添加到amount中。
     */
    class SubpixelNumber {
        remainder: number;
        /**
         * 以amount递增余数，将值截断为int，存储新的余数并将amount设置为当前值。
         * @param amount
         */
        update(amount: number): number;
        /**
         * 将余数重置为0。当一个物体与一个不可移动的物体碰撞时有用。
         * 在这种情况下，您将希望将亚像素余数归零，因为它是空的和无效的碰撞。
         */
        reset(): void;
    }
}
declare module es {
    /**
     * 三角剖分
     */
    class Triangulator {
        /**
         * 最后一次三角调用中使用的点列表的三角形列表项的索引
         */
        triangleIndices: number[];
        private _triPrev;
        private _triNext;
        static testPointTriangle(point: Vector2, a: Vector2, b: Vector2, c: Vector2): boolean;
        /**
         * 计算一个三角形列表，该列表完全覆盖给定点集所包含的区域。如果点不是CCW，则将arePointsCCW参数传递为false
         * @param points 定义封闭路径的点列表
         * @param arePointsCCW
         */
        triangulate(points: Vector2[], arePointsCCW?: boolean): void;
        private initialize;
    }
}
declare module es {
    class TypeUtils {
        static getType(obj: any): any;
    }
}
declare module es {
    class Vector2Ext {
        /**
         * 检查三角形是CCW还是CW
         * @param a
         * @param center
         * @param c
         */
        static isTriangleCCW(a: Vector2, center: Vector2, c: Vector2): boolean;
        static halfVector(): Vector2;
        /**
         * 计算二维伪叉乘点(Perp(u)， v)
         * @param u
         * @param v
         */
        static cross(u: Vector2, v: Vector2): number;
        /**
         * 返回与传入向量垂直的向量
         * @param first
         * @param second
         */
        static perpendicular(first: Vector2, second: Vector2): Vector2;
        /**
         * Vector2的临时解决方案
         * 标准化把向量弄乱了
         * @param vec
         */
        static normalize(vec: Vector2): void;
        /**
         * 通过指定的矩阵对Vector2的数组中的向量应用变换，并将结果放置在另一个数组中。
         * @param sourceArray
         * @param sourceIndex
         * @param matrix
         * @param destinationArray
         * @param destinationIndex
         * @param length
         */
        static transformA(sourceArray: Vector2[], sourceIndex: number, matrix: Matrix2D, destinationArray: Vector2[], destinationIndex: number, length: number): void;
        static transformR(position: Vector2, matrix: Matrix2D, result: Vector2): void;
        /**
         * 通过指定的矩阵对Vector2的数组中的所有向量应用变换，并将结果放到另一个数组中。
         * @param sourceArray
         * @param matrix
         * @param destinationArray
         */
        static transform(sourceArray: Vector2[], matrix: Matrix2D, destinationArray: Vector2[]): void;
        static round(vec: Vector2): Vector2;
    }
}
declare class WebGLUtils {
    /**
     * 获取webgl context
     */
    static getContext(): CanvasRenderingContext2D;
}
declare namespace stopwatch {
    /**
     * 记录时间的持续时间，一些设计灵感来自物理秒表。
     */
    class Stopwatch {
        private readonly getSystemTime;
        /**
         * 秒表启动的系统时间。
         * undefined，如果秒表尚未启动，或已复位。
         */
        private _startSystemTime;
        /**
         * 秒表停止的系统时间。
         * undefined，如果秒表目前没有停止，尚未开始，或已复位。
         */
        private _stopSystemTime;
        /** 自上次复位以来，秒表已停止的系统时间总数。 */
        private _stopDuration;
        /**
         * 用秒表计时，当前等待的切片开始的时间。
         * undefined，如果秒表尚未启动，或已复位。
         */
        private _pendingSliceStartStopwatchTime;
        /**
         * 记录自上次复位以来所有已完成切片的结果。
         */
        private _completeSlices;
        constructor(getSystemTime?: GetTimeFunc);
        getState(): State;
        isIdle(): boolean;
        isRunning(): boolean;
        isStopped(): boolean;
        /**
         *
         */
        slice(): Slice;
        /**
         * 获取自上次复位以来该秒表已完成/记录的所有片的列表。
         */
        getCompletedSlices(): Slice[];
        /**
         * 获取自上次重置以来该秒表已完成/记录的所有片的列表，以及当前挂起的片。
         */
        getCompletedAndPendingSlices(): Slice[];
        /**
         * 获取关于这个秒表当前挂起的切片的详细信息。
         */
        getPendingSlice(): Slice;
        /**
         * 获取当前秒表时间。这是这个秒表自上次复位以来运行的系统时间总数。
         */
        getTime(): number;
        /**
         * 完全重置这个秒表到它的初始状态。清除所有记录的运行持续时间、切片等。
         */
        reset(): void;
        /**
         * 开始(或继续)运行秒表。
         * @param forceReset
         */
        start(forceReset?: boolean): void;
        /**
         *
         * @param recordPendingSlice
         */
        stop(recordPendingSlice?: boolean): number;
        /**
         * 计算指定秒表时间的当前挂起片。
         * @param endStopwatchTime
         */
        private calculatePendingSlice;
        /**
         * 计算指定系统时间的当前秒表时间。
         * @param endSystemTime
         */
        private caculateStopwatchTime;
        /**
         * 获取与当前秒表时间等效的系统时间。
         * 如果该秒表当前停止，则返回该秒表停止时的系统时间。
         */
        private getSystemTimeOfCurrentStopwatchTime;
        /**
         * 结束/记录当前挂起的片的私有实现。
         * @param endStopwatchTime
         */
        private recordPendingSlice;
    }
    /**
     * 返回某个系统的“当前时间”的函数。
     * 惟一的要求是，对该函数的每次调用都必须返回一个大于或等于前一次对该函数的调用的数字。
     */
    type GetTimeFunc = () => number;
    enum State {
        /** 秒表尚未启动，或已复位。 */
        IDLE = "IDLE",
        /** 秒表正在运行。 */
        RUNNING = "RUNNING",
        /** 秒表以前还在跑，但现在已经停了。 */
        STOPPED = "STOPPED"
    }
    function setDefaultSystemTimeGetter(systemTimeGetter?: GetTimeFunc): void;
    /**
     * 由秒表记录的单个“薄片”的测量值
     */
    interface Slice {
        /** 秒表显示的时间在这一片开始的时候。 */
        readonly startTime: number;
        /** 秒表在这片片尾的时间。 */
        readonly endTime: number;
        /** 该切片的运行时间 */
        readonly duration: number;
    }
}
declare module linq {
    class Enumerable {
        /**
         * 在指定范围内生成一个整数序列。
         */
        static range(start: number, count: number): List<number>;
        /**
         * 生成包含一个重复值的序列。
         */
        static repeat<T>(element: T, count: number): List<T>;
    }
}
declare module linq {
    /**
     * 检查传递的参数是否为对象
     */
    const isObj: <T>(x: T) => boolean;
    /**
     * 创建一个否定谓词结果的函数
     */
    const negate: <T>(pred: (...args: T[]) => boolean) => (...args: T[]) => boolean;
    /**
     * 比较器助手
     */
    const composeComparers: <T>(previousComparer: (a: T, b: T) => number, currentComparer: (a: T, b: T) => number) => (a: T, b: T) => number;
    const keyComparer: <T>(_keySelector: (key: T) => string, descending?: boolean) => (a: T, b: T) => number;
}
declare module linq {
    type PredicateType<T> = (value?: T, index?: number, list?: T[]) => boolean;
    class List<T> {
        protected _elements: T[];
        /**
         * 默认为列表的元素
         */
        constructor(elements?: T[]);
        /**
         * 在列表的末尾添加一个对象。
         */
        add(element: T): void;
        /**
         * 将一个对象追加到列表的末尾。
         */
        append(element: T): void;
        /**
         * 在列表的开头添加一个对象。
         */
        prepend(element: T): void;
        /**
         * 将指定集合的元素添加到列表的末尾。
         */
        addRange(elements: T[]): void;
        /**
         * 对序列应用累加器函数。
         */
        aggregate<U>(accumulator: (accum: U, value?: T, index?: number, list?: T[]) => any, initialValue?: U): any;
        /**
         * 确定序列的所有元素是否满足一个条件。
         */
        all(predicate: PredicateType<T>): boolean;
        /**
         * 确定序列是否包含任何元素。
         */
        any(): boolean;
        any(predicate: PredicateType<T>): boolean;
        /**
         * 计算通过对输入序列的每个元素调用转换函数获得的一系列数值的平均值。
         */
        average(): number;
        average(transform: (value?: T, index?: number, list?: T[]) => any): number;
        /**
         * 将序列的元素转换为指定的类型。
         */
        cast<U>(): List<U>;
        /**
         * 从列表中删除所有元素。
         */
        clear(): void;
        /**
         * 连接两个序列。
         */
        concat(list: List<T>): List<T>;
        /**
         * 确定一个元素是否在列表中。
         */
        contains(element: T): boolean;
        /**
         * 返回序列中元素的数量。
         */
        count(): number;
        count(predicate: PredicateType<T>): number;
        /**
         * 返回指定序列的元素，或者如果序列为空，则返回单例集合中类型参数的默认值。
         */
        defaultIfEmpty(defaultValue?: T): List<T>;
        /**
         * 根据指定的键选择器从序列中返回不同的元素。
         */
        distinctBy(keySelector: (key: T) => string | number): List<T>;
        /**
         * 返回序列中指定索引处的元素。
         */
        elementAt(index: number): T;
        /**
         * 返回序列中指定索引处的元素，如果索引超出范围，则返回默认值。
         */
        elementAtOrDefault(index: number): T | null;
        /**
         * 通过使用默认的相等比较器来比较值，生成两个序列的差值集。
         */
        except(source: List<T>): List<T>;
        /**
         * 返回序列的第一个元素。
         */
        first(): T;
        first(predicate: PredicateType<T>): T;
        /**
         * 返回序列的第一个元素，如果序列不包含元素，则返回默认值。
         */
        firstOrDefault(): T;
        firstOrDefault(predicate: PredicateType<T>): T;
        /**
         * 对列表中的每个元素执行指定的操作。
         */
        forEach(action: (value?: T, index?: number, list?: T[]) => any): void;
        /**
         * 根据指定的键选择器函数对序列中的元素进行分组。
         */
        groupBy<TResult>(grouper: (key: T) => string | number, mapper?: (element: T) => TResult): {
            [key: string]: TResult[];
        };
        /**
         * 根据键的相等将两个序列的元素关联起来，并将结果分组。默认的相等比较器用于比较键。
         */
        groupJoin<U, R>(list: List<U>, key1: (k: T) => any, key2: (k: U) => any, result: (first: T, second: List<U>) => R): List<R>;
        /**
         * 返回列表中某个元素第一次出现的索引。
         */
        indexOf(element: T): number;
        /**
         * 向列表中插入一个元素在指定索引处。
         */
        insert(index: number, element: T): void | Error;
        /**
         * 通过使用默认的相等比较器来比较值，生成两个序列的交集集。
         */
        intersect(source: List<T>): List<T>;
        /**
         * 基于匹配的键将两个序列的元素关联起来。默认的相等比较器用于比较键。
         */
        join<U, R>(list: List<U>, key1: (key: T) => any, key2: (key: U) => any, result: (first: T, second: U) => R): List<R>;
        /**
         * 返回序列的最后一个元素。
         */
        last(): T;
        last(predicate: PredicateType<T>): T;
        /**
         * 返回序列的最后一个元素，如果序列不包含元素，则返回默认值。
         */
        lastOrDefault(): T;
        lastOrDefault(predicate: PredicateType<T>): T;
        /**
         * 返回泛型序列中的最大值。
         */
        max(): number;
        max(selector: (value: T, index: number, array: T[]) => number): number;
        /**
         * 返回泛型序列中的最小值。
         */
        min(): number;
        min(selector: (value: T, index: number, array: T[]) => number): number;
        /**
         * 根据指定的类型筛选序列中的元素。
         */
        ofType<U>(type: any): List<U>;
        /**
         * 根据键按升序对序列中的元素进行排序。
         */
        orderBy(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): List<T>;
        /**
         * 根据键值降序对序列中的元素进行排序。
         */
        orderByDescending(keySelector: (key: T) => any, comparer?: (a: T, b: T) => number): List<T>;
        /**
         * 按键按升序对序列中的元素执行后续排序。
         */
        thenBy(keySelector: (key: T) => any): List<T>;
        /**
         * 根据键值按降序对序列中的元素执行后续排序。
         */
        thenByDescending(keySelector: (key: T) => any): List<T>;
        /**
         * 从列表中删除第一个出现的特定对象。
         */
        remove(element: T): boolean;
        /**
         * 删除与指定谓词定义的条件匹配的所有元素。
         */
        removeAll(predicate: PredicateType<T>): List<T>;
        /**
         * 删除列表指定索引处的元素。
         */
        removeAt(index: number): void;
        /**
         * 颠倒整个列表中元素的顺序。
         */
        reverse(): List<T>;
        /**
         * 将序列中的每个元素投射到一个新形式中。
         */
        select<TOut>(selector: (element: T, index: number) => TOut): List<TOut>;
        /**
         * 将序列的每个元素投影到一个列表中。并将得到的序列扁平化为一个序列。
         */
        selectMany<TOut extends List<any>>(selector: (element: T, index: number) => TOut): TOut;
        /**
         * 通过使用默认的相等比较器对元素的类型进行比较，确定两个序列是否相等。
         */
        sequenceEqual(list: List<T>): boolean;
        /**
         * 返回序列中唯一的元素，如果序列中没有恰好一个元素，则抛出异常。
         */
        single(predicate?: PredicateType<T>): T;
        /**
         * 返回序列中唯一的元素，如果序列为空，则返回默认值;如果序列中有多个元素，此方法将抛出异常。
         */
        singleOrDefault(predicate?: PredicateType<T>): T;
        /**
         * 绕过序列中指定数量的元素，然后返回剩余的元素。
         */
        skip(amount: number): List<T>;
        /**
         * 省略序列中最后指定数量的元素，然后返回剩余的元素。
         */
        skipLast(amount: number): List<T>;
        /**
         * 只要指定条件为真，就绕过序列中的元素，然后返回剩余的元素。
         */
        skipWhile(predicate: PredicateType<T>): List<T>;
        /**
         * 计算通过对输入序列的每个元素调用转换函数获得的数值序列的和。
         */
        sum(): number;
        sum(transform: (value?: T, index?: number, list?: T[]) => number): number;
        /**
         * 从序列的开始返回指定数量的连续元素。
         */
        take(amount: number): List<T>;
        /**
         * 从序列的末尾返回指定数目的连续元素。
         */
        takeLast(amount: number): List<T>;
        /**
         * 返回序列中的元素，只要指定的条件为真。
         */
        takeWhile(predicate: PredicateType<T>): List<T>;
        /**
         * 复制列表中的元素到一个新数组。
         */
        toArray(): T[];
        /**
         * 创建一个<dictionary>从List< T>根据指定的键选择器函数。
         */
        toDictionary<TKey>(key: (key: T) => TKey): List<{
            Key: TKey;
            Value: T;
        }>;
        toDictionary<TKey, TValue>(key: (key: T) => TKey, value: (value: T) => TValue): List<{
            Key: TKey;
            Value: T | TValue;
        }>;
        /**
         * 创建一个Set从一个Enumerable.List< T>。
         */
        toSet(): Set<any>;
        /**
         * 创建一个List< T>从一个Enumerable.List< T>。
         */
        toList(): List<T>;
        /**
         * 创建一个查找，TElement>从一个IEnumerable< T>根据指定的键选择器和元素选择器函数。
         */
        toLookup<TResult>(keySelector: (key: T) => string | number, elementSelector: (element: T) => TResult): {
            [key: string]: TResult[];
        };
        /**
         * 基于谓词过滤一系列值。
         */
        where(predicate: PredicateType<T>): List<T>;
        /**
         * 将指定的函数应用于两个序列的对应元素，生成结果序列。
         */
        zip<U, TOut>(list: List<U>, result: (first: T, second: U) => TOut): List<TOut>;
    }
    /**
     * 表示已排序的序列。该类的方法是通过使用延迟执行来实现的。
     * 即时返回值是一个存储执行操作所需的所有信息的对象。
     * 在通过调用对象的ToDictionary、ToLookup、ToList或ToArray方法枚举对象之前，不会执行由该方法表示的查询
     */
    class OrderedList<T> extends List<T> {
        private _comparer;
        constructor(elements: T[], _comparer: (a: T, b: T) => number);
        /**
         * 按键按升序对序列中的元素执行后续排序。
         * @override
         */
        thenBy(keySelector: (key: T) => any): List<T>;
        /**
         * 根据键值按降序对序列中的元素执行后续排序。
         * @override
         */
        thenByDescending(keySelector: (key: T) => any): List<T>;
    }
}
declare module es {
    interface ITimer {
        context: any;
        /**
         * 调用stop以停止此计时器再次运行。这对非重复计时器没有影响。
         */
        stop(): any;
        /**
         * 将计时器的运行时间重置为0
         */
        reset(): any;
        /**
         *
         */
        getContext<T>(): T;
    }
}
declare module es {
    class Timer implements ITimer {
        context: any;
        _timeInSeconds: number;
        _repeats: boolean;
        _onTime: (timer: ITimer) => void;
        _isDone: boolean;
        _elapsedTime: number;
        getContext<T>(): T;
        reset(): void;
        stop(): void;
        tick(): boolean;
        initialize(timeInsSeconds: number, repeats: boolean, context: any, onTime: (timer: ITimer) => void): void;
        /**
         * 空出对象引用，以便在js需要时GC可以清理它们的引用
         */
        unload(): void;
    }
}
declare module es {
    /**
     * 允许动作的延迟和重复执行
     */
    class TimerManager extends GlobalManager {
        _timers: Timer[];
        update(): void;
        /**
         * 调度一个一次性或重复的计时器，该计时器将调用已传递的动作
         * @param timeInSeconds
         * @param repeats
         * @param context
         * @param onTime
         */
        schedule(timeInSeconds: number, repeats: boolean, context: any, onTime: (timer: ITimer) => void): Timer;
    }
}
