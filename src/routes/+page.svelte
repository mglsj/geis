<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import Header from "$lib/components/ui/Header.svelte";
import ProfileCard from "$lib/components/ui/ProfileCard.svelte";
import * as Card from "$lib/components/shadcn/card";
import * as Tabs from "$lib/components/shadcn/tabs";
import { H1, H2, Muted, Small } from "$lib/components/ui/typography";
import * as Table from "$lib/components/shadcn/table";
import {
	RiBookFill,
	RiBookLine,
	RiSchoolFill,
	RiSchoolLine,
	RiUserFill,
	RiUserLine,
} from "remixicon-svelte";

const session = authClient.useSession();
const { data } = $props();

let tabValue: string = $state("personal");

const entries = $derived([
	{
		id: "personal",
		label: "Personal",
		icon: RiUserLine,
		iconFilled: RiUserFill,
		fields: [
			{ label: "DOB", value: data.profile?.dob },
			{ label: "Gender", value: data.profile?.gender },
			{ label: "Official Email", value: data.profile?.officialEmail },
			{ label: "Personal Email", value: data.profile?.personalEmail },
			{ label: "Mobile Number", value: data.profile?.mobile },
			{ label: "Address", value: data.profile?.address },
		],
	},
	{
		id: "academic",
		label: "Academic",
		icon: RiSchoolLine,
		iconFilled: RiSchoolFill,
		fields: [
			{ label: "Student ID", value: data.profile?.studentId },
			{ label: "Roll Number", value: data.profile?.rollNumber },
			{ label: "Enrollment Number", value: data.profile?.enrollmentNumber },
			{ label: "ABC Account", value: data.profile?.abcAccount },
			{ label: "College", value: data.profile?.college },
			{ label: "University", value: data.profile?.university },
		],
	},
	{
		id: "education",
		label: "Education",
		icon: RiBookLine,
		iconFilled: RiBookFill,
		fields: [
			{ label: "Course", value: data.profile?.course },
			{ label: "Branch", value: data.profile?.branch },
			{ label: "Specialization", value: data.profile?.specialization },
			{ label: "Course Type", value: data.profile?.courseType },
			{ label: "Semester", value: data.profile?.yearSem },
			{ label: "Section", value: data.profile?.section },
		],
	},
]);
</script>

<Header/>

<main class="p-4 pt-10 mx-auto max-w-2xl gap-4 flex flex-col align-start items-start">
    
    <H1>
        Profile
    </H1>
    
    <ProfileCard 
        name={$session.data?.user.name || "User"} 
        username={$session.data?.user.username || "username"} 
        email={$session.data?.user.email || "email"}
        image={$session.data?.user.image} 
    />

    <Tabs.Root class="w-full gap-4" bind:value={tabValue}>
        <Tabs.List class="mx-auto">
            {#each entries as entry}
                <Tabs.Trigger value={entry.id} class="data-[state=active]:border-primary! data-[state=active]:text-primary!">
                    {#if tabValue === entry.id}
                        <entry.iconFilled/>
                        {entry.label}
                    {:else}
                        <entry.icon />
                        <span class="max-sm:hidden">{entry.label}</span>
                    {/if}
                </Tabs.Trigger>
            {/each}
        </Tabs.List>
        
        {#each entries as entry}
            <Tabs.Content value={entry.id}>
                <Card.Root class="w-full">
                    <Card.Header>
                        <Card.Title>
                            <H2>{entry.label}</H2>
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <Table.Root>
                            <Table.Body>
                                {#each entry.fields as field}
                                    <Table.Row>
                                        <Table.Cell >
                                            <Muted>
                                                {field.label}
                                            </Muted>
                                        </Table.Cell>
                                        <Table.Cell class="whitespace-normal">
                                            <Small>
                                                {field.value || "-"}
                                            </Small>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>
        {/each}
    </Tabs.Root>

    <Muted>
        ERP last synced on: {data.profile?.syncedAt ? new Date(data.profile.syncedAt).toLocaleString() : "Never"}
    </Muted>
</main>