/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
    BaseContract,
    BytesLike,
    FunctionFragment,
    Result,
    Interface,
    ContractRunner,
    ContractMethod,
    Listener,
} from "ethers"
import type {
    TypedContractEvent,
    TypedDeferredTopicFilter,
    TypedEventLog,
    TypedListener,
    TypedContractMethod,
} from "../common"

export interface TwitterInterface extends Interface {
    getFunction(
        nameOrSignature: "PER_TWEET" | "getOwner" | "i_owner" | "tweet",
    ): FunctionFragment

    encodeFunctionData(
        functionFragment: "PER_TWEET",
        values?: undefined,
    ): string
    encodeFunctionData(functionFragment: "getOwner", values?: undefined): string
    encodeFunctionData(functionFragment: "i_owner", values?: undefined): string
    encodeFunctionData(functionFragment: "tweet", values?: undefined): string

    decodeFunctionResult(functionFragment: "PER_TWEET", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "i_owner", data: BytesLike): Result
    decodeFunctionResult(functionFragment: "tweet", data: BytesLike): Result
}

export interface Twitter extends BaseContract {
    connect(runner?: ContractRunner | null): Twitter
    waitForDeployment(): Promise<this>

    interface: TwitterInterface

    queryFilter<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined,
    ): Promise<Array<TypedEventLog<TCEvent>>>
    queryFilter<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined,
    ): Promise<Array<TypedEventLog<TCEvent>>>

    on<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        listener: TypedListener<TCEvent>,
    ): Promise<this>
    on<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        listener: TypedListener<TCEvent>,
    ): Promise<this>

    once<TCEvent extends TypedContractEvent>(
        event: TCEvent,
        listener: TypedListener<TCEvent>,
    ): Promise<this>
    once<TCEvent extends TypedContractEvent>(
        filter: TypedDeferredTopicFilter<TCEvent>,
        listener: TypedListener<TCEvent>,
    ): Promise<this>

    listeners<TCEvent extends TypedContractEvent>(
        event: TCEvent,
    ): Promise<Array<TypedListener<TCEvent>>>
    listeners(eventName?: string): Promise<Array<Listener>>
    removeAllListeners<TCEvent extends TypedContractEvent>(
        event?: TCEvent,
    ): Promise<this>

    PER_TWEET: TypedContractMethod<[], [bigint], "view">

    getOwner: TypedContractMethod<[], [string], "view">

    i_owner: TypedContractMethod<[], [string], "view">

    tweet: TypedContractMethod<[], [void], "payable">

    getFunction<T extends ContractMethod = ContractMethod>(
        key: string | FunctionFragment,
    ): T

    getFunction(
        nameOrSignature: "PER_TWEET",
    ): TypedContractMethod<[], [bigint], "view">
    getFunction(
        nameOrSignature: "getOwner",
    ): TypedContractMethod<[], [string], "view">
    getFunction(
        nameOrSignature: "i_owner",
    ): TypedContractMethod<[], [string], "view">
    getFunction(
        nameOrSignature: "tweet",
    ): TypedContractMethod<[], [void], "payable">

    filters: {}
}
