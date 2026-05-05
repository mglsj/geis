<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import Header from "$lib/components/ui/Header.svelte";
import ProfileCard from "$lib/components/ui/ProfileCard.svelte";
import * as Card from "$lib/components/shadcn/card";
import * as Field from "$lib/components/shadcn/field";
import { Input } from "$lib/components/shadcn/input";
import { Textarea } from "$lib/components/shadcn/textarea";
import * as Tabs from "$lib/components/shadcn/tabs";
import { H1, H2, H3, Large, Lead, Muted } from "$lib/components/ui/typography";
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
            <Tabs.Trigger value="personal" class="data-[state=active]:border-primary! data-[state=active]:text-primary!">
                {#if tabValue === "personal"}
                    <RiUserFill/>
                    Personal
                {:else}
                    <RiUserLine />
                    <span class="max-sm:hidden">Personal</span>
                {/if}
            </Tabs.Trigger>
            <Tabs.Trigger value="academic" class="data-[state=active]:border-primary! data-[state=active]:text-primary!">
                {#if tabValue === "academic"}
                    <RiSchoolFill />
                    Academic
                {:else}
                    <RiSchoolLine />
                    <span class="max-sm:hidden">Academic</span>
                {/if}
            </Tabs.Trigger>
            <Tabs.Trigger value="education" class="data-[state=active]:border-primary! data-[state=active]:text-primary!">
                {#if tabValue === "education"}
                    <RiBookFill />
                    Education
                {:else}
                    <RiBookLine />
                    <span class="max-sm:hidden">Education</span>
                {/if}
            </Tabs.Trigger>
        </Tabs.List>
           
        <Tabs.Content value="personal">
            <Card.Root class="w-full">
            <Card.Header>
                <Card.Title>
                    <H2>Personal</H2>
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <Field.Group>
                    <Field.Field>
                        <Field.Label>
                            DOB
                        </Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.dob} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>
                            Gender
                        </Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.gender} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>
                            Official Email
                        </Field.Label>
                        <Field.Content>
                            <Input type="email" disabled value={data.profile?.officialEmail} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>
                            Personal Email
                        </Field.Label>
                        <Field.Content>
                            <Input type="email" disabled value={data.profile?.personalEmail} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>
                            Mobile Number
                        </Field.Label>
                        <Field.Content>
                            <Input type="tel" disabled value={data.profile?.mobile} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>
                            Address
                        </Field.Label>
                        <Field.Content>
                            <Textarea disabled value={data.profile?.address} />
                        </Field.Content>
                    </Field.Field>
                </Field.Group>
            </Card.Content>
        </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="academic">
            <Card.Root class="w-full">
            <Card.Header>
                <Card.Title>
                    <H2>Academic</H2>
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <Field.Group>
                    <Field.Field>
                        <Field.Label>Student ID</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.studentId} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Roll Number</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.rollNumber} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Enrollment Number</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.enrollmentNumber} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>ABC Account</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.abcAccount} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>College</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.college} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>University</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.university} />
                        </Field.Content>
                    </Field.Field>
                </Field.Group>
            </Card.Content>
        </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="education">
            <Card.Root class="w-full">
            <Card.Header>
                <Card.Title>
                    <H2>Education</H2>
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <Field.Group>
                    <Field.Field>
                        <Field.Label>Course</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.course} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Branch</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.branch} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Specialization</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.specialization} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Course Type</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.courseType} />
                        </Field.Content>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label>Semester</Field.Label>
                        <Field.Content>
                            <Input type="text" disabled value={data.profile?.yearSem} />
                        </Field.Content>
                    </Field.Field>
                </Field.Group>
            </Card.Content>
        </Card.Root>
        </Tabs.Content>
    </Tabs.Root>

    <Muted>
        ERP last synced on: {data.profile?.syncedAt ? new Date(data.profile.syncedAt).toLocaleString() : "Never"}
    </Muted>
</main>