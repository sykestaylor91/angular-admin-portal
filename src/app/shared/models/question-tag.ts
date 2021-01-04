export interface TagGroup {
    Group: string;
    Tags: string[];
    SubGroups?: TagGroup[];
    color?: string;
    open?: boolean;
}
